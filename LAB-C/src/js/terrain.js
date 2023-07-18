import * as THREE from 'three';
import { addCorkoak, mainBranch, sideBranch, leaf1, leaf2 } from './corkoak.js';
import { randomBetween } from './common.js';
import { skydomeRadius } from './skydome.js';
import { xMin, xMax, zMin, zMax } from './house.js';

var terrain;
var corkoaksBranchList = [];
var corkoaksLeafList = [];

function getRandomXZ() {
    'use strict';
    const padding = 65;
    let x = Math.floor(randomBetween(-(skydomeRadius-padding), (skydomeRadius-padding)));
    let z;
    if (x < xMin - padding || x > xMax + padding) {
        z = Math.floor(randomBetween(-Math.sqrt(((skydomeRadius-padding)**2)-(x**2)), Math.sqrt(((skydomeRadius-padding)**2)-(x**2))));
    } else {
        z = Math.floor(randomBetween(-Math.sqrt(((skydomeRadius-padding)**2)-(x**2)), Math.sqrt(((skydomeRadius-padding)**2)-(x**2)),
        zMin - padding,
        zMax + padding)
        );
    }
    return [x, z];
}

function getHeightForXZ(xz) {
    'use strict';

    let x = xz[0] + terrain.geometry.parameters.width / 2;
    let z = xz[1] + terrain.geometry.parameters.height / 2;
    let vertices = terrain.geometry.attributes.position.array;
    let width = terrain.geometry.parameters.width;
    let height = terrain.geometry.parameters.height;
    let xIndex = Math.floor(x * (terrain.geometry.parameters.width) / width);
    let zIndex = Math.floor(z * (terrain.geometry.parameters.height) / height);
    let index = xIndex + zIndex * width;
    return vertices[index * 3 + 2];
}

function loadImage(path) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = path;
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Could not load heightmap'));
        image.src = path;
    });
}

async function addTerrain(scene, materials) {
    'use strict';
    const image = await loadImage('resources/heightmap.png'); // we need to wait for the image to load
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const data = context.getImageData(0, 0, image.width, image.height);
    const geometry = new THREE.PlaneGeometry(image.width, image.height, image.width - 1, image.height - 1);

    const vertices = geometry.attributes.position.array;

    for (let i = 0, j = 0; i < vertices.length && j < data.data.length; i += 3, j += 4) {
        vertices[i + 2] = Math.sqrt(data.data[j] + data.data[j + 1] + data.data[j + 2]) * 5;
    }
    geometry.computeVertexNormals();

    terrain = new THREE.Mesh(geometry, materials[0]);
    terrain.rotation.x = -Math.PI / 2;
    scene.add(terrain);

    populateTerrain(scene, [materials[1], materials[2]]);
}

function populateTerrain(scene, materials) {
    'use strict';
    let x, z;
    let corkoak;
    let corkoaks = [];
    let colision = false;
    for (let i = 0; i < 70; i++) {
        let arr = getRandomXZ();
        x = arr[0];
        z = arr[1];
        for (let j = 0; j < corkoaks.length; j++) {
            if (Math.sqrt((x - corkoaks[j].position.x)**2 + (z - corkoaks[j].position.z)**2) < 65) {
                colision = true;
                break;
            }
        }
        if (colision) {
            colision = false;
            i--;
            continue;
        }
        corkoak = addCorkoak(scene, x, getHeightForXZ([x, z]), z, materials);
        corkoaks[i] = corkoak;
        corkoaksBranchList.push(mainBranch, sideBranch);
        corkoaksLeafList.push(leaf1, leaf2);
    }
}

export {
    addTerrain,
    terrain,
    getRandomXZ,
    getHeightForXZ,
    corkoaksBranchList,
    corkoaksLeafList

}