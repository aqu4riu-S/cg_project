import * as THREE from 'three';
import { createEllipsoid } from './common.js';
var ufo, chassis, ufo_window;
var ufo_point_lights = [];
var ufo_spot_light;

const ufo_dimensions = {
    chassis: {
        radiusX: 16,
        radiusY: 4.5,
        radiusZ: 16,
    },
    ufo_window: {
        radius: 6,
    },
    pointLight: {
        radius: 1,
        count: 16,
    },
    spotLight: {
        radius: 8,
        length: 1,
    }
}


function addUFO(scene, materials) {
    'use strict';

    ufo = new THREE.Object3D();
    ufo.userData = {
        movVecPos: new THREE.Vector3(0, 0, 0),
        movVecNeg: new THREE.Vector3(0, 0, 0),
        vAlpha: 0
    }

    chassis = createEllipsoid(materials[0], ufo_dimensions.chassis.radiusX, ufo_dimensions.chassis.radiusY, ufo_dimensions.chassis.radiusZ);
    ufo.add(chassis);
    ufo_window = new THREE.Mesh(new THREE.SphereGeometry(ufo_dimensions.ufo_window.radius, 32, 32), materials[1]);
    ufo_window.position.y = ufo_dimensions.chassis.radiusY/2;
    ufo.add(ufo_window);
    let pointLights = new Array(ufo_dimensions.pointLight.count);
    let light;
    for (let i=0; i<ufo_dimensions.pointLight.count; i++) {
        pointLights[i] = new THREE.Mesh(new THREE.SphereGeometry(ufo_dimensions.pointLight.radius, 32, 32), materials[2]);
        pointLights[i].position.x = (ufo_dimensions.spotLight.radius + ufo_dimensions.pointLight.radius*3)*Math.cos((2*Math.PI/ufo_dimensions.pointLight.count)*i);
        pointLights[i].position.y = -Math.sqrt(ufo_dimensions.chassis.radiusY**2 * (1 - ((ufo_dimensions.spotLight.radius + ufo_dimensions.pointLight.radius*3)**2)/(ufo_dimensions.chassis.radiusX**2)));
        pointLights[i].position.z = (ufo_dimensions.spotLight.radius + ufo_dimensions.pointLight.radius*3)*Math.sin((2*Math.PI/ufo_dimensions.pointLight.count)*i);
        light = new THREE.PointLight(0xffff00, 0.5, 30, 2);
        pointLights[i].add(light);
        ufo_point_lights.push(light);
        ufo.add(pointLights[i]);
    }
    const spotLightTarget = new THREE.Object3D();
    spotLightTarget.position.y = -ufo_dimensions.chassis.radiusY-ufo_dimensions.spotLight.length/2-1;
    let spotLight = new THREE.Mesh(new THREE.CylinderGeometry(ufo_dimensions.spotLight.radius, ufo_dimensions.spotLight.radius, ufo_dimensions.spotLight.length, 32), materials[3]);
    light = new THREE.SpotLight(0xffffff, 0.9);
    light.penumbra = 0.5;
    light.decay = 2;
    light.target = spotLightTarget;
    spotLight.add(light)
    spotLight.position.y = -ufo_dimensions.chassis.radiusY;
    ufo.add(spotLightTarget);
    ufo.add(spotLight);
    ufo_spot_light = light;
    scene.add(ufo);

}


export { addUFO, ufo, chassis, ufo_window, ufo_point_lights, ufo_spot_light };