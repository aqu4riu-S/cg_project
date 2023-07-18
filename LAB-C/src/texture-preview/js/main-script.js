import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { floralCamp, starrySky } from './canvas.js';

/* GLOBAL VARIABLES */

var scene, renderer;

const CameraType = {
    FLORAL_CAMP: 0,
    STARRY_SKY: 1,
}
const camera = new Array(2);
var icamera = CameraType.FLORAL_CAMP;

const scale = 2;
const floralCampCanvasWidth = 512/(2**scale);
const floralCampCanvasHeight = 512/(2**scale);
const starrySkyCanvasWidth = 1024/(2**scale);
const starrySkyCanvasHeight = 4096/(2**scale);

var floralCampPlane;
var starrySkyPlane;


const Keys = {
    FLORAL_CAMP: { CODE: 'Digit1', IS_KEY_DOWN: false },
    STARRY_SKY: { CODE: 'Digit2', IS_KEY_DOWN: false },
}

const MaterialIndex = {
    FLORAL_CAMP: 0,
    STARRY_SKY: 1,
}

const materials = new Array(2);
materials[MaterialIndex.FLORAL_CAMP] = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: new THREE.Texture() });
materials[MaterialIndex.STARRY_SKY] = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: new THREE.Texture() });


var t = Date.now();

/* CREATE SCENE(S) */

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0xfff5e7);
}

/* CREATE CAMERA(S) */

function createOrthographicCamera(position, isFloralCamp) {
    "use strict";

    let aspectRatio = window.innerWidth / window.innerHeight;
    let viewSize;
    if (isFloralCamp) {
        viewSize = Math.max(floralCampCanvasWidth, floralCampCanvasHeight);
    } else {
        viewSize = Math.max(starrySkyCanvasWidth, starrySkyCanvasHeight);        
    }
    var new_camera = new THREE.OrthographicCamera(
        (-aspectRatio * viewSize) / 2,
        (aspectRatio * viewSize) / 2,
        viewSize / 2,
        -viewSize / 2,
        0,
        1000
    );
    new_camera.position.x = position[0];
    new_camera.position.y = position[1];
    new_camera.position.z = position[2];
    if (isFloralCamp) {
        new_camera.rotateY(Math.PI);
    }
    return new_camera;
}

/* CREATE LIGHT(S) */
/* CREATE OBJECT3D(S) */
function addPlane(scene, material, isFloralCamp) {
    'use strict';

    if (isFloralCamp) {
        floralCampPlane = new THREE.Mesh(new THREE.PlaneGeometry(floralCampCanvasWidth, floralCampCanvasHeight, floralCampCanvasWidth-1, floralCampCanvasHeight-1), material);
        floralCampPlane.position.z = 200;
        scene.add(floralCampPlane);
    } else {
        starrySkyPlane = new THREE.Mesh(new THREE.PlaneGeometry(starrySkyCanvasWidth, starrySkyCanvasHeight, starrySkyCanvasWidth-1, starrySkyCanvasHeight-1), material);
        starrySkyPlane.position.z = -200;
        scene.add(starrySkyPlane);
    }
    
}

/* CHECK COLLISION(S) */
/* HANDLE COLLISION(S) */
/* UPDATE */

/* DISPLAY */

function render() {
    'use strict';

    if (Object.values(CameraType).includes(icamera)) {
        renderer.render(scene, camera[icamera]);
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

    createScene();


    addPlane(scene, materials[MaterialIndex.FLORAL_CAMP], true);
    addPlane(scene, materials[MaterialIndex.STARRY_SKY], false);

    camera[CameraType.FLORAL_CAMP] = createOrthographicCamera([0, 0, 0], true);
    camera[CameraType.STARRY_SKY] = createOrthographicCamera([0, 0, 0], false);

    document.addEventListener("keydown", onKeyDown);
}

/* ANIMATION CYCLE */

function animate() {
    'use strict';

    render();

    requestAnimationFrame(animate);
}

/* KEY DOWN CALLBACK */

function onKeyDown() {
    'use strict';

    let texture;
    switch (event.code) {
        case Keys.FLORAL_CAMP.CODE:
            /* Create new texture and apply it */
            icamera = CameraType.FLORAL_CAMP;
            materials[MaterialIndex.FLORAL_CAMP].map = floralCamp(1000);
            break;

        case Keys.STARRY_SKY.CODE:
            /* Create new texture and apply it */
            icamera = CameraType.STARRY_SKY;
            materials[MaterialIndex.STARRY_SKY].map = starrySky(500);
            break;
    }
}

export { init, animate, floralCampPlane, starrySkyPlane };