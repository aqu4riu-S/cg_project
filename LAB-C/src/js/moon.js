import * as THREE from 'three';

var moon;
var moonDirectionalLight;
function addMoon(scene) {
    'use strict';
    
    // Create moon and add emissivity
    const radius = 50;
    var geometry = new THREE.SphereGeometry(radius, 32, 32);
    var material = new THREE.MeshStandardMaterial({ color: 0xFBDB65, emissive: 0xFBDB65, emissiveIntensity: 2 });
    moon = new THREE.Mesh(geometry, material);
    
    // Create spotlight
    moonDirectionalLight = new THREE.DirectionalLight(
                                        0xFBDB65,       //color
                                        0.1,              //intensity
                                        );             //decay
    moonDirectionalLight.visible = true;
    moonDirectionalLight.target = scene;

    // Add spotlight to moon
    moon.add(moonDirectionalLight);
    

    scene.add(moon);

}

export { addMoon, moon, moonDirectionalLight }