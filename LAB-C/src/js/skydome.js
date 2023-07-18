import * as THREE from 'three';

var skyDome;
const skydomeRadius = 500;

function addSkyDome(scene, material) {
    'use strict';

    var geometry = new THREE.SphereGeometry(skydomeRadius, skydomeRadius, skydomeRadius);

    skyDome = new THREE.Mesh(geometry, material);


    scene.add(skyDome);
}

export { addSkyDome, skyDome, skydomeRadius };
