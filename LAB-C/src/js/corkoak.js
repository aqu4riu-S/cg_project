import * as THREE from 'three';
import { randomBetween, createEllipsoid } from './common.js';

var mainBranch, sideBranch, leaf1, leaf2;

const corkoak_dimensions = {
    branch: {
        radiusM: 2,
        radiusS: 1.5,
        Max_lengthM: 30,
        Min_lengthM: 22,
        Max_lengthS: 20,
        Min_lengthS: 17,
        // angles are in relation to axis Y
        Max_angleM: Math.PI/4,
        Min_angleM: Math.PI/6,
    },
    leaves: {
        Max_radiusX: 12,
        Min_radiusX: 8,
        Max_radiusY: 6,
        Min_radiusY: 4,
        Max_radiusZ: 15,
        Min_radiusZ: 12
    },
}


function addCorkoak(scene, x, y, z, materials) {
    'use strict';

    let branchMaterial = materials[0];
    let leafMaterial = materials[1];
    let corkoak = new THREE.Object3D();
    let aux;
    
    let mainBranchLength = randomBetween(corkoak_dimensions.branch.Min_lengthM, corkoak_dimensions.branch.Max_lengthM);
    let sideBranchLength = randomBetween(corkoak_dimensions.branch.Min_lengthS, corkoak_dimensions.branch.Max_lengthS);
    
    // Main Branch
    mainBranch = new THREE.CylinderGeometry(corkoak_dimensions.branch.radiusM, corkoak_dimensions.branch.radiusM, mainBranchLength, 32);
    mainBranch = new THREE.Mesh(mainBranch, branchMaterial);
    aux = new THREE.Vector3(0, -mainBranchLength/2, -corkoak_dimensions.branch.radiusM);
    let xAxis = new THREE.Vector3(1, 0, 0);
    let centerMainBranch = new THREE.Vector3(0, 0, 0);
    let mainBranchRotation = randomBetween(corkoak_dimensions.branch.Min_angleM, corkoak_dimensions.branch.Max_angleM);
    aux.applyAxisAngle(xAxis, mainBranchRotation);
    mainBranch.rotateX(mainBranchRotation);


    centerMainBranch.sub(aux);
    mainBranch.position.x = centerMainBranch.x;
    mainBranch.position.y = centerMainBranch.y;
    mainBranch.position.z = centerMainBranch.z;

    // Side branch
    sideBranch = new THREE.CylinderGeometry(corkoak_dimensions.branch.radiusS, corkoak_dimensions.branch.radiusS, sideBranchLength, 32);
    sideBranch = new THREE.Mesh(sideBranch, branchMaterial);
    aux = new THREE.Vector3(0, -sideBranchLength/2 + corkoak_dimensions.branch.radiusS, 0);
    let centerSideBranch = new THREE.Vector3(0, 0, 0);
    let sideBranchRotation = -Math.PI/2 + mainBranch.rotation.x; // it's always 90º in relation to the main branch 
    sideBranch.rotateX(sideBranchRotation); 
    aux.applyAxisAngle(xAxis, sideBranchRotation);
    centerSideBranch.sub(aux);
    aux = new THREE.Vector3(0, mainBranchLength/3, 0);
    aux.applyAxisAngle(xAxis, mainBranchRotation);
    centerSideBranch.add(aux);

    sideBranch.position.x = centerSideBranch.x;
    sideBranch.position.y = centerSideBranch.y;
    sideBranch.position.z = centerSideBranch.z;


    
    let leaf1x = randomBetween(corkoak_dimensions.leaves.Min_radiusX, corkoak_dimensions.leaves.Max_radiusX);
    let leaf1y = randomBetween(corkoak_dimensions.leaves.Min_radiusY, corkoak_dimensions.leaves.Max_radiusY);
    let leaf1z = randomBetween(corkoak_dimensions.leaves.Min_radiusZ, corkoak_dimensions.leaves.Max_radiusZ);
    leaf1 = createEllipsoid(leafMaterial, leaf1x, leaf1y, leaf1z);
    let centerLeaf1 = new THREE.Vector3(0, 0, 0);
    aux = new THREE.Vector3(0, mainBranchLength/2, 0);
    aux.applyAxisAngle(xAxis, mainBranchRotation);
    centerLeaf1.add(centerMainBranch);
    centerLeaf1.add(aux);

    leaf1.position.x = centerLeaf1.x;
    leaf1.position.y = centerLeaf1.y;
    leaf1.position.z = centerLeaf1.z;
  
    let leaf2x = randomBetween(corkoak_dimensions.leaves.Min_radiusX, corkoak_dimensions.leaves.Max_radiusX);
    let leaf2y = randomBetween(corkoak_dimensions.leaves.Min_radiusY, corkoak_dimensions.leaves.Max_radiusY);
    let leaf2z = randomBetween(corkoak_dimensions.leaves.Min_radiusZ, corkoak_dimensions.leaves.Max_radiusZ);
    leaf2 = createEllipsoid(leafMaterial, leaf2x, leaf2y, leaf2z);
    let centerLeaf2 = new THREE.Vector3(0, 0, 0);
    aux = new THREE.Vector3(0, sideBranchLength/2, 0);
    aux.applyAxisAngle(xAxis, sideBranchRotation);
    centerLeaf2.add(centerSideBranch);
    centerLeaf2.add(aux);

    leaf2.position.x = centerLeaf2.x;
    leaf2.position.y = centerLeaf2.y;
    leaf2.position.z = centerLeaf2.z;

    corkoak.add(mainBranch);
    corkoak.add(sideBranch);    
    corkoak.add(leaf1);
    corkoak.add(leaf2);
    corkoak.position.set(x, y, z);
    corkoak.rotateY(randomBetween(0, 2*Math.PI));
    scene.add(corkoak);
    return corkoak;
}


export { addCorkoak, mainBranch, sideBranch, leaf1, leaf2 };