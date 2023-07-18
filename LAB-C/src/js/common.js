import * as THREE from 'three';

function randomBetween(min, max, leapMin, leapMax) {
    // if leapMin and leapMax are not defined, then the random number is between min and max
    // if leapMin and leapMax are defined, then the random number is between min and max, but not between leapMin and leapMax
    console.log(min, max, leapMin, leapMax);
    if (leapMin === undefined || leapMax === undefined) {
        return Math.random() * (max - min) + min;
    } else {
        let leap = leapMax - leapMin;
        let random = Math.random() * (max - min - leap) + min;
        if (random >= leapMin) {
            random += leap;
        }
        return random;
    }
}

function createEllipsoid(material, radiusX, radiusY, radiusZ) {
    'use strict';
    let geometry = new THREE.SphereGeometry(1, 32, 32);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(radiusX, radiusY, radiusZ);
    return mesh;
}

export { randomBetween, createEllipsoid };