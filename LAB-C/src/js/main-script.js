import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { addTerrain, terrain, corkoaksBranchList, corkoaksLeafList } from './terrain.js';
import { addSkyDome, skyDome } from './skydome.js';
import { addHouse, houseMesh, borderMesh, roofMesh, doorsMesh, windowsMesh } from './house.js';
import { addUFO, ufo, chassis, ufo_window, ufo_point_lights, ufo_spot_light } from './ufo.js';
import { addMoon, moon, moonDirectionalLight } from './moon.js';
import { floralCamp, starrySky } from '../texture-preview/js/canvas.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';


/* GLOBAL VARIABLES */

var scene, renderer;
const CameraType = {
    ISOMETRIC_PERSPECTIVE: 0,
    STEREO_CAMERA: 1
}

const camera = new Array();
var icamera = CameraType.ISOMETRIC_PERSPECTIVE;

const Keys = {
    FLORAL_CAMP: { CODE: "Digit1", IS_KEY_DOWN: false },
    STARRY_SKY: { CODE: "Digit2", IS_KEY_DOWN: false },
    LEFT_ARROW: { CODE: "ArrowLeft", IS_KEY_DOWN: false },
    UP_ARROW: { CODE: "ArrowUp", IS_KEY_DOWN: false },
    RIGHT_ARROW: { CODE: "ArrowRight", IS_KEY_DOWN: false },
    DOWN_ARROW: { CODE: "ArrowDown", IS_KEY_DOWN: false },
    SPACE_KEY: { CODE: "Space", IS_KEY_DOWN: false },
    MOON_SPOTLIGHT: { CODE: "KeyD", IS_KEY_DOWN: false },
    POINT_LIGHTS: { CODE: "KeyP", IS_KEY_DOWN: false },
    SPOT_LIGHT: { CODE: "KeyS", IS_KEY_DOWN: false },
    KEY_3: { CODE: "Digit3", IS_KEY_DOWN: false },
    KEY_R: { CODE: "KeyR", IS_KEY_DOWN: false },
    KEY_Q: { CODE: "KeyQ", IS_KEY_DOWN: false },
    KEY_W: { CODE: "KeyW", IS_KEY_DOWN: false },
    KEY_E: { CODE: "KeyE", IS_KEY_DOWN: false }
}

const MaterialIndex = {
    FLORAL_CAMP: 0,
    STARRY_SKY: 1,
    CORKOAK_BRANCH: 2,
    CORKOAK_LEAF: 3,
    UFO_CHASSIS: 4,
    UFO_WINDOW: 5,
    UFO_POINT_LIGHT: 6,
    UFO_SPOT_LIGHT: 7,
    HOUSE: 8,
    BORDERS: 9,
    ROOF: 10,
    DOORS: 11,
    WINDOWS: 12,
}

const MaterialType = {
    ORIGINAL: 0,
    LAMBERT: 1,
    PHONG: 2,
    TOON: 3
}

const materials = new Array();
materials[MaterialIndex.FLORAL_CAMP] = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
materials[MaterialIndex.STARRY_SKY] = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
materials[MaterialIndex.CORKOAK_BRANCH] = new THREE.MeshBasicMaterial({ color: 0x8b4513, wireframe: false });
materials[MaterialIndex.CORKOAK_LEAF] = new THREE.MeshBasicMaterial({ color: 0x228b22, wireframe: false });
materials[MaterialIndex.UFO_CHASSIS] = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false });
materials[MaterialIndex.UFO_WINDOW] = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
materials[MaterialIndex.UFO_POINT_LIGHT] = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: false });
materials[MaterialIndex.UFO_SPOT_LIGHT] = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false });
materials[MaterialIndex.HOUSE] = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false, side: THREE.DoubleSide });
materials[MaterialIndex.BORDERS] = new THREE.MeshBasicMaterial({ color: 0x0C6BC2, wireframe: false, side: THREE.DoubleSide });
materials[MaterialIndex.ROOF] = new THREE.MeshBasicMaterial({ color: 0x8B0000, wireframe: false, side: THREE.DoubleSide });
materials[MaterialIndex.DOORS] = new THREE.MeshBasicMaterial({ color: 0x964B00, wireframe: false, side: THREE.DoubleSide });
materials[MaterialIndex.WINDOWS] = new THREE.MeshBasicMaterial({ color: 0xF9E9B9, wireframe: false, side: THREE.DoubleSide });


var new_materials = new Array(8);
new_materials[MaterialIndex.FLORAL_CAMP] =
    [
        materials[MaterialIndex.FLORAL_CAMP],
        new THREE.MeshLambertMaterial({ color: materials[MaterialIndex.FLORAL_CAMP].color, map: materials[MaterialIndex.FLORAL_CAMP].map, wireframe: false, side: THREE.DoubleSide }),
        new THREE.MeshPhongMaterial({ color: materials[MaterialIndex.FLORAL_CAMP].color, map: materials[MaterialIndex.FLORAL_CAMP].map, wireframe: false, side: THREE.DoubleSide }),
        new THREE.MeshToonMaterial({ color: materials[MaterialIndex.FLORAL_CAMP].color, map: materials[MaterialIndex.FLORAL_CAMP].map, wireframe: false, side: THREE.DoubleSide })
    ];
new_materials[MaterialIndex.STARRY_SKY] =
    [
        materials[MaterialIndex.STARRY_SKY],
        new THREE.MeshLambertMaterial({ color: materials[MaterialIndex.STARRY_SKY].color, map: materials[MaterialIndex.STARRY_SKY].map, wireframe: false, side: THREE.DoubleSide }),
        new THREE.MeshPhongMaterial({ color: materials[MaterialIndex.STARRY_SKY].color, map: materials[MaterialIndex.STARRY_SKY].map, wireframe: false, side: THREE.DoubleSide }),
        new THREE.MeshToonMaterial({ color: materials[MaterialIndex.STARRY_SKY].color, map: materials[MaterialIndex.STARRY_SKY].map, wireframe: false, side: THREE.DoubleSide })
    ];
new_materials[MaterialIndex.CORKOAK_BRANCH] =
    [
        materials[MaterialIndex.CORKOAK_BRANCH],
        new THREE.MeshLambertMaterial({ color: materials[MaterialIndex.CORKOAK_BRANCH].color, wireframe: false }),
        new THREE.MeshPhongMaterial({ color: materials[MaterialIndex.CORKOAK_BRANCH].color, wireframe: false }),
        new THREE.MeshToonMaterial({ color: materials[MaterialIndex.CORKOAK_BRANCH].color, wireframe: false })
    ];
new_materials[MaterialIndex.CORKOAK_LEAF] =
    [
        materials[MaterialIndex.CORKOAK_LEAF],
        new THREE.MeshLambertMaterial({ color: materials[MaterialIndex.CORKOAK_LEAF].color, wireframe: false }),
        new THREE.MeshPhongMaterial({ color: materials[MaterialIndex.CORKOAK_LEAF].color, wireframe: false }),
        new THREE.MeshToonMaterial({ color: materials[MaterialIndex.CORKOAK_LEAF].color, wireframe: false })
    ];
new_materials[MaterialIndex.UFO_CHASSIS] =
    [
        materials[MaterialIndex.UFO_CHASSIS],
        new THREE.MeshLambertMaterial({ color: materials[MaterialIndex.UFO_CHASSIS].color, wireframe: false }),
        new THREE.MeshPhongMaterial({ color: materials[MaterialIndex.UFO_CHASSIS].color, wireframe: false }),
        new THREE.MeshToonMaterial({ color: materials[MaterialIndex.UFO_CHASSIS].color, wireframe: false })
    ];
new_materials[MaterialIndex.UFO_WINDOW] =
    [
        materials[MaterialIndex.UFO_WINDOW],
        new THREE.MeshLambertMaterial({ color: materials[MaterialIndex.UFO_WINDOW].color, wireframe: false }),
        new THREE.MeshPhongMaterial({ color: materials[MaterialIndex.UFO_WINDOW].color, wireframe: false }),
        new THREE.MeshToonMaterial({ color: materials[MaterialIndex.UFO_WINDOW].color, wireframe: false })
    ];
new_materials[MaterialIndex.UFO_POINT_LIGHT] =
    [
        materials[MaterialIndex.UFO_POINT_LIGHT],
        new THREE.MeshLambertMaterial({ color: materials[MaterialIndex.UFO_POINT_LIGHT].color, wireframe: false }),
        new THREE.MeshPhongMaterial({ color: materials[MaterialIndex.UFO_POINT_LIGHT].color, wireframe: false }),
        new THREE.MeshToonMaterial({ color: materials[MaterialIndex.UFO_POINT_LIGHT].color, wireframe: false })
    ];
new_materials[MaterialIndex.UFO_SPOT_LIGHT] =
    [
        materials[MaterialIndex.UFO_SPOT_LIGHT],
        new THREE.MeshLambertMaterial({ color: materials[MaterialIndex.UFO_SPOT_LIGHT].color, wireframe: false }),
        new THREE.MeshPhongMaterial({ color: materials[MaterialIndex.UFO_SPOT_LIGHT].color, wireframe: false }),
        new THREE.MeshToonMaterial({ color: materials[MaterialIndex.UFO_SPOT_LIGHT].color, wireframe: false })
    ];
new_materials[MaterialIndex.HOUSE] =
    [
        materials[MaterialIndex.HOUSE],
        new THREE.MeshLambertMaterial({ color: materials[MaterialIndex.HOUSE].color, wireframe: false }),
        new THREE.MeshPhongMaterial({ color: materials[MaterialIndex.HOUSE].color, wireframe: false }),
        new THREE.MeshToonMaterial({ color: materials[MaterialIndex.HOUSE].color, wireframe: false })
    ];
new_materials[MaterialIndex.BORDERS] =
    [
        materials[MaterialIndex.BORDERS],
        new THREE.MeshLambertMaterial({ color: materials[MaterialIndex.BORDERS].color, wireframe: false }),
        new THREE.MeshPhongMaterial({ color: materials[MaterialIndex.BORDERS].color, wireframe: false }),
        new THREE.MeshToonMaterial({ color: materials[MaterialIndex.BORDERS].color, wireframe: false })
    ];
new_materials[MaterialIndex.ROOF] =
    [
        materials[MaterialIndex.ROOF],
        new THREE.MeshLambertMaterial({ color: materials[MaterialIndex.ROOF].color, wireframe: false, side: THREE.DoubleSide }),
        new THREE.MeshPhongMaterial({ color: materials[MaterialIndex.ROOF].color, wireframe: false, side: THREE.DoubleSide }),
        new THREE.MeshToonMaterial({ color: materials[MaterialIndex.ROOF].color, wireframe: false, side: THREE.DoubleSide })
    ];

new_materials[MaterialIndex.DOORS] =
    [
        materials[MaterialIndex.DOORS],
        new THREE.MeshLambertMaterial({ color: materials[MaterialIndex.DOORS].color, wireframe: false }),
        new THREE.MeshPhongMaterial({ color: materials[MaterialIndex.DOORS].color, wireframe: false }),
        new THREE.MeshToonMaterial({ color: materials[MaterialIndex.DOORS].color, wireframe: false })
    ];

new_materials[MaterialIndex.WINDOWS] =
    [
        materials[MaterialIndex.WINDOWS],
        new THREE.MeshLambertMaterial({ color: materials[MaterialIndex.WINDOWS].color, wireframe: false }),
        new THREE.MeshPhongMaterial({ color: materials[MaterialIndex.WINDOWS].color, wireframe: false }),
        new THREE.MeshToonMaterial({ color: materials[MaterialIndex.WINDOWS].color, wireframe: false })
    ];

const HouseParts = {
    HOUSE: 0,
    BORDERS: 1,
    ROOF: 2,
    DOORS: 3,
    WINDOWS: 4,
}

var HouseMaterials = new Array(5);
HouseMaterials[HouseParts.HOUSE] = materials[MaterialIndex.HOUSE];
HouseMaterials[HouseParts.BORDERS] = materials[MaterialIndex.BORDERS];
HouseMaterials[HouseParts.ROOF] = materials[MaterialIndex.ROOF];
HouseMaterials[HouseParts.DOORS] = materials[MaterialIndex.DOORS];
HouseMaterials[HouseParts.WINDOWS] = materials[MaterialIndex.WINDOWS];


var controls;

const clock = new THREE.Clock(true);

var ambientLight;

var lastUsedMaterial = MaterialType.LAMBERT;
var lightEffects = false;

var floralCampTexture;
var starrySkyTexture;

/* CREATE SCENE(S) */

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x000000);

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);
}

/* CREATE CAMERA(S) */

function createPerspectiveCamera(position) {
    'use strict';

    var new_camera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        3000);
    new_camera.position.x = position[0];
    new_camera.position.y = position[1];
    new_camera.position.z = position[2];
    new_camera.lookAt(scene.position);
    return new_camera;
}

function createStereoCamera(position) {
    'use strict';

    var new_camera = new THREE.StereoCamera(45,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    new_camera.position = position;
    //new_camera.position.y = position[1];
    //new_camera.position.z = position[2];
    return new_camera;
}

/* CREATE LIGHT(S) */
/* CREATE OBJECT3D(S) */
/* CHECK COLLISION(S) */
/* HANDLE COLLISION(S) */
/* UPDATE */

function updateObjectsMaterial(objectsList, objectType, materialType) {
    'use strict';

    materials[objectType] = new_materials[objectType][materialType];

    let texture;
    for (var i = 0; i < objectsList.length; i++) {
        texture = objectsList[i].material.map;
        objectsList[i].material = new_materials[objectType][materialType];
        objectsList[i].material.map = texture;

    }
}


function updateUFO(deltaTime) {
    'use strict';

    var resVec = new THREE.Vector3();

    resVec.addVectors(ufo.userData.movVecPos, ufo.userData.movVecNeg)
    resVec.normalize().multiplyScalar(deltaTime * 100);

    ufo.rotation.y += (Math.PI / 2) * deltaTime;

    ufo.position.add(resVec)

}
/* DISPLAY */

function render() {
    'use strict';

    if (Object.values(CameraType).includes(icamera)) {
        if (renderer.xr.enabled && icamera == CameraType.STEREO_CAMERA) {
            renderer.render(scene, camera[icamera].cameraL);
            renderer.render(scene, camera[icamera].cameraR);
        }
        else {
            renderer.render(scene, camera[icamera]);
        }
    } else {
        throw new Error("Invalid camera type");
    }
}

/* INITIALIZE ANIMATION CYCLE */

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    // VR
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(renderer));


    createScene();

    camera[0] = createPerspectiveCamera([200, 120, 140]);
    camera[1] = createStereoCamera([50, 50, 50]);

    controls = new OrbitControls(camera[icamera], renderer.domElement);
    controls.update();

    //add ambient light
    ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    let texture = floralCamp(1000);
    texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    materials[MaterialIndex.FLORAL_CAMP].map = texture;
    texture = starrySky(500);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 2);
    materials[MaterialIndex.STARRY_SKY].map = texture;

    addSkyDome(scene, materials[MaterialIndex.STARRY_SKY]);
    addTerrain(scene, [materials[MaterialIndex.FLORAL_CAMP], materials[MaterialIndex.CORKOAK_BRANCH], materials[MaterialIndex.CORKOAK_LEAF]]);
    addHouse(scene, HouseMaterials);


    addUFO(scene, [
        materials[MaterialIndex.UFO_CHASSIS],
        materials[MaterialIndex.UFO_WINDOW],
        materials[MaterialIndex.UFO_POINT_LIGHT],
        materials[MaterialIndex.UFO_SPOT_LIGHT]
    ]);

    addMoon(scene);

    moon.position.y = 200;
    moon.position.x = -450

    ufo.position.y = 100;

    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    renderer.xr.addEventListener("sessionstart", positionCamera);
}

/* ANIMATION CYCLE */
var t;

function animate() {
    'use strict';

    controls.update();

    let delta = clock.getDelta();
    updateUFO(delta);

    render();

    renderer.setAnimationLoop(animate)
    //requestAnimationFrame(animate);
}

/* RESIZE WINDOW CALLBACK */

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0 && !renderer.xr.isPresenting) {
        camera[icamera].aspect = renderer.getSize().width / renderer.getSize().height;
        camera[icamera].updateProjectionMatrix();
    }
}


/* KEY DOWN CALLBACK */

function onKeyDown() {
    'use strict';

    let texture;
    switch (event.code) {
        case Keys.FLORAL_CAMP.CODE:
            texture = floralCamp(1000);
            texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            materials[MaterialIndex.FLORAL_CAMP].map = texture;
            break;

        case Keys.STARRY_SKY.CODE:
            texture = starrySky(500);
            texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 2);
            materials[MaterialIndex.STARRY_SKY].map = texture;
            break;

        case Keys.DOWN_ARROW.CODE:
            ufo.userData.movVecPos.setZ(4);
            Keys.DOWN_ARROW.IS_KEY_DOWN = true;
            break;

        case Keys.UP_ARROW.CODE:
            ufo.userData.movVecNeg.setZ(-4);
            Keys.UP_ARROW.IS_KEY_DOWN = true;
            break;

        case Keys.LEFT_ARROW.CODE:
            ufo.userData.movVecNeg.setX(-4);
            Keys.LEFT_ARROW.IS_KEY_DOWN = true;
            break;

        case Keys.RIGHT_ARROW.CODE:
            ufo.userData.movVecPos.setX(4);
            Keys.RIGHT_ARROW.IS_KEY_DOWN = true;
            break;

        case Keys.MOON_SPOTLIGHT.CODE:
            moonDirectionalLight.visible = !moonDirectionalLight.visible;
            break;

        case Keys.KEY_Q.CODE:
            updateObjectsMaterial(corkoaksBranchList, MaterialIndex.CORKOAK_BRANCH, MaterialType.LAMBERT);
            updateObjectsMaterial(corkoaksLeafList, MaterialIndex.CORKOAK_LEAF, MaterialType.LAMBERT);
            updateObjectsMaterial([chassis], MaterialIndex.UFO_CHASSIS, MaterialType.LAMBERT);
            updateObjectsMaterial([ufo_window], MaterialIndex.UFO_WINDOW, MaterialType.LAMBERT);
            updateObjectsMaterial([terrain], MaterialIndex.FLORAL_CAMP, MaterialType.LAMBERT);
            updateObjectsMaterial([skyDome], MaterialIndex.STARRY_SKY, MaterialType.LAMBERT);
            updateObjectsMaterial([houseMesh], MaterialIndex.HOUSE, MaterialType.LAMBERT);
            updateObjectsMaterial([borderMesh], MaterialIndex.BORDERS, MaterialType.LAMBERT);
            updateObjectsMaterial([roofMesh], MaterialIndex.ROOF, MaterialType.LAMBERT);
            updateObjectsMaterial([doorsMesh], MaterialIndex.DOORS, MaterialType.LAMBERT);
            updateObjectsMaterial([windowsMesh], MaterialIndex.WINDOWS, MaterialType.LAMBERT);

            lastUsedMaterial = MaterialType.LAMBERT;
            break;


        case Keys.KEY_W.CODE:
            updateObjectsMaterial(corkoaksBranchList, MaterialIndex.CORKOAK_BRANCH, MaterialType.PHONG);
            updateObjectsMaterial(corkoaksLeafList, MaterialIndex.CORKOAK_LEAF, MaterialType.PHONG);
            updateObjectsMaterial([chassis], MaterialIndex.UFO_CHASSIS, MaterialType.PHONG);
            updateObjectsMaterial([ufo_window], MaterialIndex.UFO_WINDOW, MaterialType.PHONG);
            updateObjectsMaterial([terrain], MaterialIndex.FLORAL_CAMP, MaterialType.PHONG);
            updateObjectsMaterial([skyDome], MaterialIndex.STARRY_SKY, MaterialType.PHONG);
            updateObjectsMaterial([houseMesh], MaterialIndex.HOUSE, MaterialType.PHONG);
            updateObjectsMaterial([borderMesh], MaterialIndex.BORDERS, MaterialType.PHONG);
            updateObjectsMaterial([roofMesh], MaterialIndex.ROOF, MaterialType.PHONG);
            updateObjectsMaterial([doorsMesh], MaterialIndex.DOORS, MaterialType.PHONG);
            updateObjectsMaterial([windowsMesh], MaterialIndex.WINDOWS, MaterialType.PHONG);

            lastUsedMaterial = MaterialType.PHONG;
            break;

        case Keys.KEY_E.CODE:
            updateObjectsMaterial(corkoaksBranchList, MaterialIndex.CORKOAK_BRANCH, MaterialType.TOON);
            updateObjectsMaterial(corkoaksLeafList, MaterialIndex.CORKOAK_LEAF, MaterialType.TOON);
            updateObjectsMaterial([chassis], MaterialIndex.UFO_CHASSIS, MaterialType.TOON);
            updateObjectsMaterial([ufo_window], MaterialIndex.UFO_WINDOW, MaterialType.TOON);
            updateObjectsMaterial([terrain], MaterialIndex.FLORAL_CAMP, MaterialType.TOON);
            updateObjectsMaterial([skyDome], MaterialIndex.STARRY_SKY, MaterialType.TOON);
            updateObjectsMaterial([houseMesh], MaterialIndex.HOUSE, MaterialType.TOON);
            updateObjectsMaterial([borderMesh], MaterialIndex.BORDERS, MaterialType.TOON);
            updateObjectsMaterial([roofMesh], MaterialIndex.ROOF, MaterialType.TOON);
            updateObjectsMaterial([doorsMesh], MaterialIndex.DOORS, MaterialType.TOON);
            updateObjectsMaterial([windowsMesh], MaterialIndex.WINDOWS, MaterialType.TOON);

            lastUsedMaterial = MaterialType.TOON;
            break;


        case Keys.KEY_R.CODE:

            lightEffects = !lightEffects;
            var new_material;
            if (lightEffects) {
                new_material = lastUsedMaterial;
            }
            else {
                new_material = MaterialType.ORIGINAL;
            }
            updateObjectsMaterial(corkoaksBranchList, MaterialIndex.CORKOAK_BRANCH, new_material);
            updateObjectsMaterial(corkoaksLeafList, MaterialIndex.CORKOAK_LEAF, new_material);
            updateObjectsMaterial([chassis], MaterialIndex.UFO_CHASSIS, new_material);
            updateObjectsMaterial([ufo_window], MaterialIndex.UFO_WINDOW, new_material);
            updateObjectsMaterial([terrain], MaterialIndex.FLORAL_CAMP, new_material);
            updateObjectsMaterial([skyDome], MaterialIndex.STARRY_SKY, new_material);
            updateObjectsMaterial([houseMesh], MaterialIndex.HOUSE, new_material);
            updateObjectsMaterial([borderMesh], MaterialIndex.BORDERS, new_material);
            updateObjectsMaterial([roofMesh], MaterialIndex.ROOF, new_material);
            updateObjectsMaterial([doorsMesh], MaterialIndex.DOORS, new_material);
            updateObjectsMaterial([windowsMesh], MaterialIndex.WINDOWS, new_material);

            break;
        
        case Keys.POINT_LIGHTS.CODE:
            //iterate point lights list and toggle visibility
            for (var i = 0; i < ufo_point_lights.length; i++) {
                ufo_point_lights[i].visible = !ufo_point_lights[i].visible;
            }
            break;
        
        case Keys.SPOT_LIGHT.CODE:
            //iterate spot lights list and toggle visibilit
            ufo_spot_light.visible = !ufo_spot_light.visible;

        case Keys.KEY_3.CODE:
            icamera = CameraType.ISOMETRIC_PERSPECTIVE;
            break;
    }
}

/* KEY UP CALLBACK */

function onKeyUp() {
    'use strict';

    switch (event.code) {
        case Keys.DOWN_ARROW.CODE:
            ufo.userData.movVecPos.setZ(0);
            Keys.DOWN_ARROW.IS_KEY_DOWN = false;
            break;

        case Keys.UP_ARROW.CODE:
            ufo.userData.movVecNeg.setZ(0);
            Keys.UP_ARROW.IS_KEY_DOWN = false;
            break;

        case Keys.LEFT_ARROW.CODE:
            ufo.userData.movVecNeg.setX(0);
            Keys.LEFT_ARROW.IS_KEY_DOWN = false;
            break;

        case Keys.RIGHT_ARROW.CODE:
            ufo.userData.movVecPos.setX(0);
            Keys.RIGHT_ARROW.IS_KEY_DOWN = false;
            break;
        
    }
}

function positionCamera() {
    'use strict';

    // Create a group
    const cameraGroup = new THREE.Group();

    // Add the camera to the group
    cameraGroup.add(camera[0]);

    // Translate the group (which will move the camera along with it)
    const groupTranslation = new THREE.Vector3(150, 150, 250); // Adjust the values as needed
    cameraGroup.position.add(groupTranslation);


}


export { init, animate };