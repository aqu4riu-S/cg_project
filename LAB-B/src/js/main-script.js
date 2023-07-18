/* GLOBAL VARIABLES */

var scene, renderer;
const CameraType = {
    FRONT: 0,
    SIDE: 1,
    TOP: 2,
    ISOMETRIC_ORTHOGRAPHIC: 3,
    ISOMETRIC_PERSPECTIVE: 4,
};

const Keys = {
    CAM_1: { CODE: "Digit1", IS_KEY_DOWN: false },
    CAM_2: { CODE: "Digit2", IS_KEY_DOWN: false },
    CAM_3: { CODE: "Digit3", IS_KEY_DOWN: false },
    CAM_4: { CODE: "Digit4", IS_KEY_DOWN: false },
    CAM_5: { CODE: "Digit5", IS_KEY_DOWN: false },
    TOGGLE_WIREFRAME: { CODE: "Digit6", IS_KEY_DOWN: false },
    FEET_UP: { CODE: "KeyQ", IS_KEY_DOWN: false },
    FEET_DOWN: { CODE: "KeyA", IS_KEY_DOWN: false },
    WAIST_UP: { CODE: "KeyW", IS_KEY_DOWN: false },
    WAIST_DOWN: { CODE: "KeyS", IS_KEY_DOWN: false },
    UPPER_MEMBERS_MEDIAL: { CODE: "KeyE", IS_KEY_DOWN: false },
    UPPER_MEMBERS_LATERAL: { CODE: "KeyD", IS_KEY_DOWN: false },
    HEAD_IN: { CODE: "KeyR", IS_KEY_DOWN: false },
    HEAD_OUT: { CODE: "KeyF", IS_KEY_DOWN: false },
    LEFT_ARROW: { CODE: "ArrowLeft", IS_KEY_DOWN: false },
    UP_ARROW: { CODE: "ArrowUp", IS_KEY_DOWN: false },
    RIGHT_ARROW: { CODE: "ArrowRight", IS_KEY_DOWN: false },
    DOWN_ARROW: { CODE: "ArrowDown", IS_KEY_DOWN: false },
    TOGGLE_HELPER_AXIS: { CODE: "KeyH", IS_KEY_DOWN: false },
    LSHIFT_KEY: { CODE: "ShiftLeft", IS_KEY_DOWN: false },
    RSHIFT_KEY: { CODE: "ShiftRight", IS_KEY_DOWN: false },
    SHIFT_KEY: { CODE: "Shift", IS_KEY_DOWN: false },
};

const camera = new Array(5);
var icamera = CameraType.ISOMETRIC_ORTHOGRAPHIC;

var robot, robot_box, feet, legs, rArm, lArm, head;
var collided = false;

var trailer, trailer_box;
var robot_corner_coordinates;

var axesHelper;

const offset = 2;

const materials = new Array(4);
materials[0] = new THREE.MeshBasicMaterial({ color: 0x05418f, wireframe: false }); 
materials[1] = new THREE.MeshBasicMaterial({ color: 0x878787, wireframe: false }); 
materials[2] = new THREE.MeshBasicMaterial({ color: 0xf70808, wireframe: false }); 
materials[3] = new THREE.MeshBasicMaterial({ color: 0x191515, wireframe: false }); 
materials[4] = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, wireframe: false });


var theta1 = 0,
    theta2 = 0,
    theta3 = 0,
    delta1 = { x: 0, z: 0 };

var t = Date.now();

/* CREATE SCENE(S) */

function createScene() {
    "use strict";

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0xfaf0e6);

    axesHelper = new THREE.AxesHelper(10);
    axesHelper.visible = false;
    scene.add(axesHelper);
}

/* CREATE CAMERA(S) */

function createPerspectiveCamera(position) {
    "use strict";

    var new_camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    new_camera.position.x = position[0];
    new_camera.position.y = position[1];
    new_camera.position.z = position[2];
    new_camera.lookAt(scene.position);
    return new_camera;
}

function createOrthographicCamera(position) {
    "use strict";

    let aspectRatio = window.innerWidth / window.innerHeight;
    let viewSize = 130;
    var new_camera = new THREE.OrthographicCamera(
        (-aspectRatio * viewSize) / 2,
        (aspectRatio * viewSize) / 2,
        viewSize / 2,
        -viewSize / 2,
        -1000,
        1000
    );
    new_camera.position.x = position[0];
    new_camera.position.y = position[1];
    new_camera.position.z = position[2];
    new_camera.lookAt(scene.position);
    return new_camera;
}

function createFrontCamera() {
    "use strict";

    return createOrthographicCamera([0, 0, 50]);
}

function createSideCamera() {
    "use strict";

    return createOrthographicCamera([50, 0, 0]);
}

function createTopCamera() {
    "use strict";

    return createOrthographicCamera([0, 50, 0]);
}

function createIsometricPerspectiveCamera(isPerspective) {
    "use strict";

    if (isPerspective) {
        return createPerspectiveCamera([60, 60, 60]);
    } else {
        return createOrthographicCamera([60, 60, 60]);
    }
}

/* CHECK COLLISIONS */

function checkLimits(trailerCorners, robotCorners) {
    return (robotCorners[0].x > trailerCorners[1].x && 
        robotCorners[1].x < trailerCorners[0].x) && 
        (robotCorners[0].y > trailerCorners[1].y && 
        robotCorners[1].y < trailerCorners[0].y) &&    
        (robotCorners[0].z > trailerCorners[1].z && 
        robotCorners[1].z < trailerCorners[0].z)    
     
}

/* HANDLE COLLISIONS */


function getCornerCoordinates(center, dimensions) {
    const halfWidth = dimensions.x / 2;
    const halfHeight = dimensions.y / 2;
    const halfDepth = dimensions.z / 2;

    const corner1 = new THREE.Vector3(
        center.x + halfWidth + offset / 2,
        center.y + halfHeight + offset / 2,
        center.z + halfDepth + offset / 2
    );

    const corner2 = new THREE.Vector3(
        center.x - halfWidth - offset / 2,
        center.y - halfHeight - offset / 2,
        center.z - halfDepth - offset / 2
    );

    return [corner1, corner2];
}


function computePosition(deltaTime) {

    var resVec = new THREE.Vector3();
    var trailerVec = new THREE.Vector3();

    resVec.addVectors(trailer.userData.movVecPos, trailer.userData.movVecNeg)

    resVec.normalize().multiplyScalar(deltaTime * 0.02)

    trailerVec.add(trailer.position)
    resVec.add(trailerVec)

    return getCornerCoordinates(resVec, trailer_box_dimensions.box)
}

/* UPDATE */

function updateRobot(deltaTime) {
    "use strict";

    let can_be_truck = true

    if (Keys.FEET_UP.IS_KEY_DOWN || Keys.FEET_DOWN.IS_KEY_DOWN) {
        feet.rotation.x = boundedTransformation(
            feet.rotation.x + robot.userData.vtheta1pos * deltaTime + robot.userData.vtheta1neg * deltaTime,
            feetRotationBoundary
        );
        (feet.rotation.x == feetRotationBoundary[1]) ? can_be_truck = true : can_be_truck = false;
    }
    if (Keys.WAIST_UP.IS_KEY_DOWN || Keys.WAIST_DOWN.IS_KEY_DOWN) {
        legs.rotation.x = boundedTransformation(
            legs.rotation.x + robot.userData.vtheta2pos * deltaTime + robot.userData.vtheta2neg * deltaTime,
            legsRotationBoundary
        );
        (legs.rotation.x == legsRotationBoundary[1]) ? can_be_truck = true : can_be_truck = false;
    }
    if (Keys.UPPER_MEMBERS_MEDIAL.IS_KEY_DOWN || Keys.UPPER_MEMBERS_LATERAL.IS_KEY_DOWN) {
        rArm.position.set(
            boundedTransformation(
                rArm.position.x -
                robot.userData.vdelta1pos * deltaTime -
                robot.userData.vdelta1neg * deltaTime,
                rArmTranslateXBoundary
            ),
            rArm.position.y,
            boundedTransformation(
                rArm.position.z -
                (robot.userData.vdelta1pos * deltaTime + robot.userData.vdelta1neg * deltaTime) /
                vdelta1Ratio,
                armTranslateZBoundary
            )
        );
        lArm.position.set(
            boundedTransformation(
                lArm.position.x +
                robot.userData.vdelta1pos * deltaTime +
                robot.userData.vdelta1neg * deltaTime,
                lArmTranslateXBoundary
            ),
            lArm.position.y,
            boundedTransformation(
                lArm.position.z -
                (robot.userData.vdelta1pos * deltaTime + robot.userData.vdelta1neg * deltaTime) /
                vdelta1Ratio,
                armTranslateZBoundary
            )
        );
        (rArm.position.z == armTranslateZBoundary[0]) ? can_be_truck = true : can_be_truck = false;
    }
    if (Keys.HEAD_IN.IS_KEY_DOWN || Keys.HEAD_OUT.IS_KEY_DOWN) {
        head.rotation.x = boundedTransformation(
            head.rotation.x + robot.userData.vtheta3pos * deltaTime + robot.userData.vtheta3neg * deltaTime,
            headRotationBoundary
        );
        (head.rotation.x == headRotationBoundary[0]) ? can_be_truck = true : can_be_truck = false;
    }

    if (!robot.userData.isTruck && can_be_truck) { isTruck() };
    if (robot.userData.isTruck && !can_be_truck) { robot.userData.isTruck = false; }

}

function updateTrailer(deltaTime) {
    'use strict';


    if (!collided && robot.userData.isTruck && !trailer.userData.isMovingToTarget && checkLimits(computePosition(deltaTime), robot_corner_coordinates)) {
        trailer.userData.isMovingToTarget = true
        collided = true

    }

    if (collided) {
        if(! checkLimits(computePosition(deltaTime), robot_corner_coordinates)){
            collided = false
        }
    }


    if(!trailer.userData.isMovingToTarget){
        var resVec = new THREE.Vector3();
        resVec.addVectors(trailer.userData.movVecPos, trailer.userData.movVecNeg)

        resVec.normalize().multiplyScalar(deltaTime * 0.02)

        trailer.position.add(resVec)

    }

    if (trailer.userData.isMovingToTarget){
        var targetVec = new THREE.Vector3();
        var target = new THREE.Vector3(0,0,-32);
        targetVec = moveToTarget(target.x,target.y,target.z);

        targetVec.normalize().multiplyScalar(deltaTime * 0.02)
        trailer.position.add(targetVec)


        if (Math.abs(trailer.position.x - target.x) <= deltaTime * 0.02 && Math.abs(trailer.position.z - target.z) <= deltaTime * 0.02){
            trailer.position.add(moveToTarget(target.x,target.y,target.z)); 
            trailer.userData.isMovingToTarget = false;
        }
    }

    trailer_box.position.x = trailer.position.x;
    trailer_box.position.y = trailer.position.y;
    trailer_box.position.z = trailer.position.z;

    trailer_box.position.y += trailer_dimensions.container.y - trailer_box_dimensions.box.y / 2
}

/* DISPLAY */

function render() {
    "use strict";

    if (Object.values(CameraType).includes(icamera)) {
        renderer.render(scene, camera[icamera]);
    } else {
        throw new Error("Invalid camera type");
    }
}

/* INITIALIZE ANIMATION CYCLE */

function init() {
    "use strict";

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    createScene();

    camera[0] = createFrontCamera();
    camera[1] = createSideCamera();
    camera[2] = createTopCamera();
    camera[3] = createIsometricPerspectiveCamera(false);
    camera[4] = createIsometricPerspectiveCamera(true);

    robot = createRobot();
    feet = robot.getObjectByName("feet");
    legs = robot.getObjectByName("legs");
    rArm = robot.getObjectByName("rArm");
    lArm = robot.getObjectByName("lArm");
    head = robot.getObjectByName("head");
    scene.add(robot);

    trailer = createTrailer()
    scene.add(trailer)

    trailer.position.y = 6 + robot_dimensions.wheel.y/3
    trailer.position.z = -40

    // COLISION DETECTION BOXES
    trailer_box = createTrailerBox(offset)
    robot_box = createRobotBox(offset)    
    
    robot_box.position.y = (robot_dimensions.antena.y / 2 + robot_dimensions.head.y + robot_dimensions.trunk.y + robot_dimensions.abdomen.y / 2 + robot_dimensions.hips.y + robot_dimensions.wheel.r / 3)
/ 2
    robot_box.position.z = -10.75

    robot_corner_coordinates = getCornerCoordinates(robot_box.position, robot_box_dimensions.box)
    
    scene.add(trailer_box)
    scene.add(robot_box)



    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    document.addEventListener("wheel", onScroll);
}

/* ANIMATION CYCLE */

function animate() {
    "use strict";
    
    let now = Date.now();
    updateRobot(now - t);

    
    updateTrailer(now - t);
    t = now;

    render();

    requestAnimationFrame(animate);
}

/* KEY DOWN CALLBACK */

function onKeyDown() {
    "use strict";

    switch (event.code) {
        case Keys.CAM_1.CODE: //1
            icamera = CameraType.FRONT;
            break;

        case Keys.CAM_2.CODE: //2
            icamera = CameraType.SIDE;
            break;

        case Keys.CAM_3.CODE: //3
            icamera = CameraType.TOP;
            break;

        case Keys.CAM_4.CODE: //4
            icamera = CameraType.ISOMETRIC_ORTHOGRAPHIC;
            break;

        case Keys.CAM_5.CODE: //5
            icamera = CameraType.ISOMETRIC_PERSPECTIVE;
            break;

        case Keys.TOGGLE_WIREFRAME.CODE: //6
            let no_materials = materials.length - 1; // last material is the helper axis
            for (let i = 0; i < no_materials; i++) {
                materials[i].wireframe = !materials[i].wireframe;
            }
            break;

        case Keys.FEET_DOWN.CODE: //Q
            if( trailer.userData.isMovingToTarget == true) break;
            robot.userData.vtheta1pos = Math.PI / 1024;
            Keys.FEET_DOWN.IS_KEY_DOWN = true;
            break;

        case Keys.FEET_UP.CODE: //A
            if( trailer.userData.isMovingToTarget == true) break;
            robot.userData.vtheta1neg = -Math.PI / 1024;
            Keys.FEET_UP.IS_KEY_DOWN = true;
            break;

        case Keys.WAIST_DOWN.CODE: //W
            if( trailer.userData.isMovingToTarget == true) break;
            robot.userData.vtheta2pos = Math.PI / 1024;
            Keys.WAIST_DOWN.IS_KEY_DOWN = true;
            break;

        case Keys.WAIST_UP.CODE: //S
            if( trailer.userData.isMovingToTarget == true) break;
            robot.userData.vtheta2neg = -Math.PI / 1024;
            Keys.WAIST_UP.IS_KEY_DOWN = true;
            break;

        case Keys.UPPER_MEMBERS_MEDIAL.CODE: //E
            if( trailer.userData.isMovingToTarget == true) break;
            robot.userData.vdelta1pos = 0.01;
            Keys.UPPER_MEMBERS_MEDIAL.IS_KEY_DOWN = true;
            break;

        case Keys.UPPER_MEMBERS_LATERAL.CODE: //D
            if( trailer.userData.isMovingToTarget == true) break;
            robot.userData.vdelta1neg = -0.01;
            Keys.UPPER_MEMBERS_LATERAL.IS_KEY_DOWN = true;
            break;

        case Keys.HEAD_IN.CODE: //R
            if( trailer.userData.isMovingToTarget == true) break;
            robot.userData.vtheta3pos = Math.PI / 1024;
            Keys.HEAD_IN.IS_KEY_DOWN = true;
            break;

        case Keys.HEAD_OUT.CODE: //F
            if( trailer.userData.isMovingToTarget == true) break;
            robot.userData.vtheta3neg = -Math.PI / 1024;
            Keys.HEAD_OUT.IS_KEY_DOWN = true;
            break;

        case Keys.DOWN_ARROW.CODE:
            trailer.userData.movVecPos.setZ(0.02);
            Keys.DOWN_ARROW.IS_KEY_DOWN = true;
            break;

        case Keys.UP_ARROW.CODE:
            trailer.userData.movVecNeg.setZ(-0.02);
            Keys.UP_ARROW.IS_KEY_DOWN = true;
            break;

        case Keys.LEFT_ARROW.CODE:
            trailer.userData.movVecNeg.setX(-0.02);
            Keys.LEFT_ARROW.IS_KEY_DOWN = true;
            break;

        case Keys.RIGHT_ARROW.CODE:
            trailer.userData.movVecPos.setX(0.02);
            Keys.RIGHT_ARROW.IS_KEY_DOWN = true;
            break;

        case Keys.TOGGLE_HELPER_AXIS.CODE:
            materials[4].opacity = (materials[4].opacity + 0.1) % 0.2;
            materials[4].wireframe = !materials[4].wireframe;
            axesHelper.visible = !axesHelper.visible;
            break;
        
        case Keys.LSHIFT_KEY.CODE:
        case Keys.RSHIFT_KEY.CODE:
            Keys.SHIFT_KEY.IS_KEY_DOWN = true;
            break;
}
}
/* KEY UP CALLBACK */

function onKeyUp() {
    "use strict";

    switch (event.code) {
        case Keys.FEET_DOWN.CODE: // a
            robot.userData.vtheta1pos = 0;
            Keys.FEET_DOWN.IS_KEY_DOWN = false;
            break;

        case Keys.FEET_UP.CODE:
            robot.userData.vtheta1neg = 0;
            Keys.FEET_UP.IS_KEY_DOWN = false;
            break;

        case Keys.WAIST_DOWN.CODE: // s
            robot.userData.vtheta2pos = 0;
            Keys.WAIST_DOWN.IS_KEY_DOWN = false;
            break;

        case Keys.WAIST_UP.CODE:
            robot.userData.vtheta2neg = 0;
            Keys.WAIST_UP.IS_KEY_DOWN = false;
            break;

        case Keys.UPPER_MEMBERS_MEDIAL.CODE: // e
            robot.userData.vdelta1pos = 0;
            Keys.UPPER_MEMBERS_MEDIAL.IS_KEY_DOWN = false;
            break;

        case Keys.UPPER_MEMBERS_LATERAL.CODE:
            robot.userData.vdelta1neg = 0;
            Keys.UPPER_MEMBERS_LATERAL.IS_KEY_DOWN = false;
            break;

        case Keys.HEAD_IN.CODE:
            robot.userData.vtheta3pos = 0;
            Keys.HEAD_IN.IS_KEY_DOWN = false;
            break;

        case Keys.HEAD_OUT.CODE: // f
            robot.userData.vtheta3neg = 0;
            Keys.HEAD_OUT.IS_KEY_DOWN = false;
            break;

        case Keys.DOWN_ARROW.CODE:
            trailer.userData.movVecPos.setZ(0);
            Keys.DOWN_ARROW.IS_KEY_DOWN = false;
            break;

        case Keys.UP_ARROW.CODE:
            trailer.userData.movVecNeg.setZ(0);
            Keys.UP_ARROW.IS_KEY_DOWN = false;
            break;

        case Keys.LEFT_ARROW.CODE:
            trailer.userData.movVecNeg.setX(0);
            Keys.LEFT_ARROW.IS_KEY_DOWN = false;
            break;

        case Keys.RIGHT_ARROW.CODE:
            trailer.userData.movVecPos.setX(0);
            Keys.RIGHT_ARROW.IS_KEY_DOWN = false;
            break;

        case Keys.LSHIFT_KEY.CODE:
        case Keys.RSHIFT_KEY.CODE:
            Keys.SHIFT_KEY.IS_KEY_DOWN = false;
            break;

    }

}

/* SCROLL CALLBACK */

function onScroll(event) {
    if (!Keys.SHIFT_KEY.IS_KEY_DOWN) {
        return;
    }
    var delta = event.deltaY;
    if (delta > 0) {
        camera[icamera].zoom = Math.max(camera[icamera].zoom - 0.1, 1);
    } else {
        camera[icamera].zoom = Math.min(camera[icamera].zoom + 0.1, 10);
    }
    camera[icamera].updateProjectionMatrix();
}
