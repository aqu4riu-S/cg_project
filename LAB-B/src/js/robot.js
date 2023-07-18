var robot_dimensions = {
    trunk: {
        x: 15,
        y: 8,
        z: 7.5,
    },
    abdomen: {
        x: 10,
        y: 6,
        z: 7.5,
    },
    hips: {
        x: 14,
        y: 3,
        z: 1,
    },
    wheel: {
        r: 2.25,
        y: 2,
    },
    forearm: {
        x: 2.5,
        y: 9.5,
        z: 2,
    },
    arm: {
        x: 3.5,
        y: 8,
        z: 4,
    },
    exhaust: {
        r: 0.5,
        y: 10.5,
    },
    head: {
        x: 4,
        y: 4,
        z: 4,
    },
    eye: {
        r: 0.5,
        y: 1,
    },
    antena: {
        r: 0.25,
        y: 2.5,
    },
    sole: {
        x: 4,
        y: 2,
        z: 5.5,
    },
    toes: {
        x: 6.5,
        y: 2,
        z: 3,
    },
    tank: {
        r: 1,
        y: 4,
    },
    thigh: {
        x: 2,
        y: 5,
        z: 2,
    },
    lowerLeg: {
        x: 4,
        y: 12,
        z: 4,
    },
};

var robot_box_dimensions = {
    box: {
        x: robot_dimensions.exhaust.r * 4 + robot_dimensions.trunk.x,
        y: robot_dimensions.antena.y / 2 + robot_dimensions.head.y + robot_dimensions.trunk.y + robot_dimensions.abdomen.y / 2 + robot_dimensions.hips.y + robot_dimensions.wheel.r / 3,
        z: robot_dimensions.sole.z + robot_dimensions.toes.z + robot_dimensions.thigh.y + robot_dimensions.lowerLeg.y + robot_dimensions.wheel.r + robot_dimensions.hips.z + 0.5
    }
}

const feetRotationBoundary = [0, Math.PI / 2];
const legsRotationBoundary = [0, Math.PI / 2];
const headRotationBoundary = [-Math.PI, 0];
const rArmTranslateXBoundary = [
    robot_dimensions.trunk.x / 2 - robot_dimensions.arm.x / 2,
    robot_dimensions.trunk.x / 2 + robot_dimensions.arm.x / 2,
];
const lArmTranslateXBoundary = [
    -rArmTranslateXBoundary[1],
    -rArmTranslateXBoundary[0],
];
const armTranslateZBoundary = [
    -robot_dimensions.trunk.z / 2 - robot_dimensions.arm.z / 2,
    -robot_dimensions.trunk.z / 2 + robot_dimensions.arm.z / 2,
];
const vdelta1Ratio = robot_dimensions.arm.x / robot_dimensions.arm.z;

function regularCylinderGeometry(radius, height) {
    "use strict";

    return new THREE.CylinderGeometry(radius, radius, height, 32);
}

function createTrunk() {
    "use strict";

    let trunk_dim = robot_dimensions.trunk;
    var trunk = new THREE.Mesh(
        new THREE.BoxGeometry(trunk_dim.x, trunk_dim.y, trunk_dim.z),
        materials[2]
    );

    return trunk;
}

function createAbdomen() {
    "use strict";

    let abdomen_dim = robot_dimensions.abdomen;
    var abdomen = new THREE.Mesh(
        new THREE.BoxGeometry(abdomen_dim.x, abdomen_dim.y, abdomen_dim.z),
        materials[1]
    );

    return abdomen;
}

function createHip() {
    "use strict";

    let hips_dim = robot_dimensions.hips;
    var hips = new THREE.Mesh(
        new THREE.BoxGeometry(hips_dim.x, hips_dim.y, hips_dim.z),
        materials[1]
    );

    return hips;
}

function createWheel() {
    "use strict";

    let wheel_dim = robot_dimensions.wheel;
    var wheel = new THREE.Mesh(
        regularCylinderGeometry(wheel_dim.r, wheel_dim.y),
        materials[3]
    );
    wheel.rotation.z = Math.PI / 2;
    return wheel;
}

function createForearm() {
    "use strict";

    let forearm_dim = robot_dimensions.forearm;
    var forearm = new THREE.Mesh(
        new THREE.BoxGeometry(forearm_dim.x, forearm_dim.y, forearm_dim.z),
        materials[2]
    );

    return forearm;
}

function createArmCube() {
    "use strict";

    let arm_dim = robot_dimensions.arm;
    var arm = new THREE.Mesh(
        new THREE.BoxGeometry(arm_dim.x, arm_dim.y, arm_dim.z),
        materials[2]
    );

    return arm;
}

function createExhaust() {
    "use strict";

    let exhaust_dim = robot_dimensions.exhaust;
    var exhaust = new THREE.Mesh(
        regularCylinderGeometry(exhaust_dim.r, exhaust_dim.y),
        materials[1]
    );

    return exhaust;
}

function createHeadCube() {
    "use strict";

    let head_dim = robot_dimensions.head;
    var head = new THREE.Mesh(
        new THREE.BoxGeometry(head_dim.x, head_dim.y, head_dim.z),
        materials[0]
    );

    return head;
}

function createEye() {
    "use strict";

    let eye_dim = robot_dimensions.eye;
    var eye = new THREE.Mesh(
        new THREE.ConeGeometry(eye_dim.r, eye_dim.y),
        materials[3]
    );
    eye.rotation.x = -Math.PI / 2;

    return eye;
}

function createAntena() {
    "use strict";

    let antena_dim = robot_dimensions.antena;
    var antena = new THREE.Mesh(
        regularCylinderGeometry(antena_dim.r, antena_dim.y),
        materials[0]
    );

    return antena;
}

function createSole() {
    "use strict";

    let sole_dim = robot_dimensions.sole;
    var sole = new THREE.Mesh(
        new THREE.BoxGeometry(sole_dim.x, sole_dim.y, sole_dim.z),
        materials[0]
    );

    return sole;
}

function createToes() {
    "use strict";

    let toes_dim = robot_dimensions.toes;
    var toes = new THREE.Mesh(
        new THREE.BoxGeometry(toes_dim.x, toes_dim.y, toes_dim.z),
        materials[0]
    );

    return toes;
}

function createTank() {
    "use strict";

    let tank_dim = robot_dimensions.tank;
    var tank = new THREE.Mesh(
        regularCylinderGeometry(tank_dim.r, tank_dim.y),
        materials[1]
    );

    return tank;
}

function createThigh() {
    "use strict";

    let thigh_dim = robot_dimensions.thigh;
    var thigh = new THREE.Mesh(
        new THREE.BoxGeometry(thigh_dim.x, thigh_dim.y, thigh_dim.z),
        materials[1]
    );

    return thigh;
}

function createLowerLeg() {
    "use strict";

    let lowerLeg_dim = robot_dimensions.lowerLeg;
    var lowerLeg = new THREE.Mesh(
        new THREE.BoxGeometry(lowerLeg_dim.x, lowerLeg_dim.y, lowerLeg_dim.z),
        materials[0]
    );

    return lowerLeg;
}

function createFeet() {
    "use strict";

    let rSole = createSole();
    rSole.position.set(
        robot_dimensions.sole.x / 2 + robot_dimensions.thigh.x / 2,
        0,
        0
    );
    let lSole = createSole();
    lSole.position.set(
        -robot_dimensions.sole.x / 2 - robot_dimensions.thigh.x / 2,
        0,
        0
    );
    let rToes = createToes();
    let lToes = createToes();
    rToes.position.set(
        robot_dimensions.toes.x / 2 + robot_dimensions.thigh.x / 2,
        0,
        robot_dimensions.sole.z / 2 + robot_dimensions.toes.z / 2
    );
    lToes.position.set(
        -robot_dimensions.toes.x / 2 - robot_dimensions.thigh.x / 2,
        0,
        robot_dimensions.sole.z / 2 + robot_dimensions.toes.z / 2
    );

    const helper_group = new THREE.Group();
    helper_group.add(rSole);
    helper_group.add(lSole);
    helper_group.add(rToes);
    helper_group.add(lToes);

    let feet = new THREE.Object3D();
    feet.name = "feet";
    feet.add(helper_group);

    helper_group.position.set(
        0,
        -robot_dimensions.sole.y / 2,
        robot_dimensions.sole.z / 2
    );
    feet.position.set(
        0,
        -robot_dimensions.thigh.y -
        robot_dimensions.lowerLeg.y -
        robot_dimensions.sole.y / 2 +
        robot_dimensions.sole.y / 2,
        -robot_dimensions.lowerLeg.z / 2
    );
    return feet;
}

function createLegs(feet) {
    "use strict";

    let rTank = createTank();
    rTank.position.set(
        robot_dimensions.thigh.x / 2 +
        robot_dimensions.lowerLeg.x +
        robot_dimensions.tank.r,
        -robot_dimensions.thigh.y - robot_dimensions.tank.y / 2,
        0
    );
    let lTank = createTank();
    lTank.position.set(
        -robot_dimensions.thigh.x / 2 -
        robot_dimensions.lowerLeg.x -
        robot_dimensions.tank.r,
        -robot_dimensions.thigh.y - robot_dimensions.tank.y / 2,
        0
    );

    let rLowerLeg = createLowerLeg();
    rLowerLeg.position.set(
        robot_dimensions.thigh.x / 2 + robot_dimensions.lowerLeg.x / 2,
        -robot_dimensions.thigh.y - robot_dimensions.lowerLeg.y / 2,
        0
    );
    let lLowerLeg = createLowerLeg();
    lLowerLeg.position.set(
        -robot_dimensions.thigh.x / 2 - robot_dimensions.lowerLeg.x / 2,
        -robot_dimensions.thigh.y - robot_dimensions.lowerLeg.y / 2,
        0
    );

    let rThigh = createThigh();
    rThigh.position.set(
        robot_dimensions.thigh.x / 2 +
        robot_dimensions.thigh.x / 2 +
        robot_dimensions.lowerLeg.x / 8,
        -robot_dimensions.thigh.y / 2,
        0
    );
    let lThigh = createThigh();
    lThigh.position.set(
        -robot_dimensions.thigh.x / 2 -
        robot_dimensions.thigh.x / 2 -
        robot_dimensions.lowerLeg.x / 8,
        -robot_dimensions.thigh.y / 2,
        0
    );

    let rMiddleWheel = createWheel();
    rMiddleWheel.position.set(
        robot_dimensions.thigh.x / 2 +
        robot_dimensions.lowerLeg.x +
        robot_dimensions.wheel.r / 2,
        -robot_dimensions.thigh.y -
        robot_dimensions.lowerLeg.y -
        robot_dimensions.sole.y +
        3 * robot_dimensions.wheel.r +
        robot_dimensions.wheel.r / 9,
        robot_dimensions.wheel.r / 6
    );
    let lMiddleWheel = createWheel();
    lMiddleWheel.position.set(
        -robot_dimensions.thigh.x / 2 -
        robot_dimensions.lowerLeg.x -
        robot_dimensions.wheel.r / 2,
        -robot_dimensions.thigh.y -
        robot_dimensions.lowerLeg.y -
        robot_dimensions.sole.y +
        3 * robot_dimensions.wheel.r +
        robot_dimensions.wheel.r / 9,
        robot_dimensions.wheel.r / 6
    );

    let rBackWheel = createWheel();
    rBackWheel.position.set(
        robot_dimensions.thigh.x / 2 +
        robot_dimensions.lowerLeg.x +
        robot_dimensions.wheel.r / 2,
        -robot_dimensions.thigh.y -
        robot_dimensions.lowerLeg.y -
        robot_dimensions.sole.y +
        robot_dimensions.wheel.r,
        robot_dimensions.wheel.r / 6
    );
    let lBackWheel = createWheel();
    lBackWheel.position.set(
        -robot_dimensions.thigh.x / 2 -
        robot_dimensions.lowerLeg.x -
        robot_dimensions.wheel.r / 2,
        -robot_dimensions.thigh.y -
        robot_dimensions.lowerLeg.y -
        robot_dimensions.sole.y +
        robot_dimensions.wheel.r,
        robot_dimensions.wheel.r / 6
    );

    let legs = new THREE.Object3D();
    legs.name = "legs";
    legs.add(feet);
    legs.add(rTank);
    legs.add(lTank);
    legs.add(rLowerLeg);
    legs.add(lLowerLeg);
    legs.add(rThigh);
    legs.add(lThigh);
    legs.add(rMiddleWheel);
    legs.add(lMiddleWheel);
    legs.add(rBackWheel);
    legs.add(lBackWheel);
    legs.position.set(0, (5 * robot_dimensions.wheel.r) / 6, 0);

    return legs;
}

function createArm(right) {
    "use strict";

    let forearm = createForearm();
    forearm.rotation.x = Math.PI / 2;
    if (right) {
        forearm.position.set(-robot_dimensions.forearm.x/2+robot_dimensions.arm.x/2, 0, robot_dimensions.forearm.y / 2);
    } else {
        forearm.position.set(robot_dimensions.forearm.x/2-robot_dimensions.arm.x/2, 0, robot_dimensions.forearm.y / 2);
    }

    let exhaust = createExhaust();
    if (right) {
        exhaust.position.set(
            robot_dimensions.arm.x / 2 + robot_dimensions.exhaust.r,
            robot_dimensions.forearm.z +
            robot_dimensions.arm.y / 2 +
            (7 * robot_dimensions.arm.y) / 32,
            0
        );
    } else {
        exhaust.position.set(
            -robot_dimensions.arm.x / 2 - robot_dimensions.exhaust.r,
            robot_dimensions.forearm.z +
            robot_dimensions.arm.y / 2 +
            (7 * robot_dimensions.arm.y) / 32,
            0
        );
    }

    let arm_cube = createArmCube();
    arm_cube.position.set(
        0,
        robot_dimensions.forearm.z / 2 + robot_dimensions.arm.y / 2,
        0
    );

    let arm = new THREE.Object3D();
    arm.name = right ? "rArm" : "lArm";
    arm.add(forearm);
    arm.add(exhaust);
    arm.add(arm_cube);
    if (right) {
        arm.position.set(
            robot_dimensions.trunk.x / 2 + robot_dimensions.arm.x / 2,
            robot_dimensions.hips.y +
            robot_dimensions.forearm.z / 2 +
            robot_dimensions.hips.y / 3,
            -robot_dimensions.trunk.z / 2 + robot_dimensions.arm.z / 2
        );
    } else {
        arm.position.set(
            -robot_dimensions.trunk.x / 2 - robot_dimensions.arm.x / 2,
            robot_dimensions.hips.y +
            robot_dimensions.forearm.z / 2 +
            robot_dimensions.hips.y / 3,
            -robot_dimensions.trunk.z / 2 + robot_dimensions.arm.z / 2
        );
    }

    return arm;
}

function createHead() {
    "use strict";

    let rEye = createEye();
    rEye.position.set(
        robot_dimensions.head.x / 4,
        robot_dimensions.head.y / 4,
        robot_dimensions.head.z / 2 - robot_dimensions.eye.y / 4
    );

    let lEye = createEye();
    lEye.position.set(
        -robot_dimensions.head.x / 4,
        robot_dimensions.head.y / 4,
        robot_dimensions.head.z / 2 - robot_dimensions.eye.y / 4
    );

    let rAntena = createAntena();
    rAntena.position.set(
        robot_dimensions.head.x / 2 + robot_dimensions.antena.r,
        robot_dimensions.head.y / 2,
        0
    );

    let lAntena = createAntena();
    lAntena.position.set(
        -robot_dimensions.head.x / 2 - robot_dimensions.antena.r,
        robot_dimensions.head.y / 2,
        0
    );

    let head_cube = createHeadCube();

    let helper_group = new THREE.Group();
    helper_group.add(rEye);
    helper_group.add(lEye);
    helper_group.add(rAntena);
    helper_group.add(lAntena);
    helper_group.add(head_cube);
    helper_group.position.set(0, robot_dimensions.head.y / 2, 0);

    let head = new THREE.Object3D();
    head.name = "head";
    head.add(helper_group);
    head.position.set(
        0,
        robot_dimensions.hips.y +
        robot_dimensions.abdomen.y / 2 +
        robot_dimensions.trunk.y
        - 0.01, // sligthly below the top of the trunk
        0
    );
    return head;
}

function createUpperBody() {
    "use strict";

    let hips = createHip();
    hips.position.set(
        0,
        -robot_dimensions.trunk.y / 2 -
        robot_dimensions.abdomen.y / 2 -
        robot_dimensions.hips.y / 2,
        robot_dimensions.trunk.z / 2 - robot_dimensions.hips.z / 2 + robot_dimensions.hips.z / 8
    );

    let abdomen = createAbdomen();
    abdomen.position.set(0, -robot_dimensions.trunk.y / 2, robot_dimensions.hips.z / 8);

    let rFrontWheel = createWheel();
    rFrontWheel.position.set(
        robot_dimensions.hips.x / 2 - robot_dimensions.wheel.y / 2,
        -robot_dimensions.trunk.y / 2 -
        robot_dimensions.abdomen.y / 2 -
        robot_dimensions.hips.y +
        (2 * robot_dimensions.wheel.r) / 3,
        0
    );

    let lFrontWheel = createWheel();
    lFrontWheel.position.set(
        -robot_dimensions.hips.x / 2 + robot_dimensions.wheel.y / 2,
        -robot_dimensions.trunk.y / 2 -
        robot_dimensions.abdomen.y / 2 -
        robot_dimensions.hips.y +
        (2 * robot_dimensions.wheel.r) / 3,
        0
    );

    let trunk = createTrunk();

    let upperBody = new THREE.Object3D();
    upperBody.add(hips);
    upperBody.add(abdomen);
    upperBody.add(rFrontWheel);
    upperBody.add(lFrontWheel);
    upperBody.add(trunk);
    upperBody.position.set(
        0,
        robot_dimensions.hips.y +
        robot_dimensions.abdomen.y / 2 +
        robot_dimensions.trunk.y / 2,
        0
    );
    return upperBody;
}

function createRobot() {
    "use strict";

    let robot = new THREE.Group();
    let feet = createFeet();
    let legs = createLegs(feet);
    let rArm = createArm(true);
    let lArm = createArm(false);
    let head = createHead();
    let upperBody = createUpperBody();
    robot.add(legs);
    robot.add(rArm);
    robot.add(lArm);
    robot.add(head);
    robot.add(upperBody);
    robot.position.y += robot_dimensions.wheel.r / 3
    robot.userData = {
        vtheta1pos: 0,
        vtheta1neg: 0,
        vtheta2pos: 0,
        vtheta2neg: 0,
        vtheta3pos: 0,
        vtheta3neg: 0,
        vdelta1pos: 0,
        vdelta1neg: 0,
        isTruck: false,
    };

    return robot;
}

function boundedTransformation(new_val, boundary) {
    if (new_val <= boundary[0]) return boundary[0];
    if (new_val >= boundary[1]) return boundary[1];
    return new_val;
}

function isTruck() {
    if (legs.rotation.x == legsRotationBoundary[1] &&
        feet.rotation.x == feetRotationBoundary[1] &&
        rArm.position.x == robot_dimensions.trunk.x / 2 - robot_dimensions.arm.x / 2 &&
        head.rotation.x == -Math.PI) { robot.userData.isTruck = true; }
    else { robot.userData.isTruck = false; }
}

function createRobotBox(offset) {
    "use strict";

    var box = new THREE.Mesh(new THREE.BoxGeometry(robot_box_dimensions.box.x + offset,
        robot_box_dimensions.box.y + offset,
        robot_box_dimensions.box.z + offset),
        materials[4]);

    return box
}

