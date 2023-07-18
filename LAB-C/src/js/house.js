import * as THREE from 'three';


// ----------------------------- GLOBAL VARS (SIZES) ------------------------------- //

const xMin = -36;
const xMax = 36;
const yMin = -12;
const yMax = 12;
const zMin = -18;
const zMax = 18;
const doorWidth = 9;
const doorHeight = 16.5;
const windowSize = 12;
const xCenterWindow = 18;
const roofMax = 9;
const door2Width = 12;
const borderOffset = 1.5
const bottomOffset = 3
const sideBlockXOffset = 6
const sideBlockZMinOffset = 3
const sideBlockZMaxOffset = 6
const chimneyWidth = 6

const HouseParts = {
    HOUSE: 0,
    BORDERS: 1,
    ROOF: 2,
    DOORS: 3,
    WINDOWS: 4,
}
// --------------------------------------------------------------------------------- //


var houseMesh;
var borderMesh;
var roofMesh;
var doorsMesh;
var windowsMesh;



function addHouse(scene, HouseMaterials) {
    'use strict';


    // ---------------------------------- HOUSE --------------------------------- //

    let houseVertices = new Float32Array( [
        // Front Face
        xMin, yMax, zMax, // 0
        xMin, yMin + bottomOffset, zMax, // 1
        xMax, yMax, zMax, // 2
        xMax, yMin + bottomOffset, zMax, // 3

        // Back face
        xMin, yMax, zMin, // 4
        xMin, yMin, zMin, // 5
        xMax, yMax, zMin, // 6
        xMax, yMin, zMin, // 7

        // Window 1
        -xCenterWindow-windowSize/2, windowSize / 2, zMax, // 8
        -xCenterWindow-windowSize/2, - windowSize / 2, zMax, // 9
        -xCenterWindow+windowSize/2, windowSize / 2, zMax, // 10
        -xCenterWindow+windowSize/2, - windowSize / 2, zMax, // 11

        // Window 2
        xCenterWindow-windowSize/2, windowSize / 2, zMax, // 12
        xCenterWindow-windowSize/2, - windowSize / 2, zMax, // 13
        xCenterWindow+windowSize/2, windowSize / 2, zMax, // 14
        xCenterWindow+windowSize/2, - windowSize / 2, zMax, // 15

        // Front Door
        -door2Width / 2, door2Width / 2 + 4.5, zMax, // 16
        -door2Width / 2, yMin + bottomOffset, zMax, // 17
        door2Width / 2, door2Width / 2 + 4.5, zMax, // 18
        door2Width / 2, yMin + bottomOffset, zMax, // 19

        // Side face
        xMax, yMin+bottomOffset, zMin, // 20
        xMax, yMax, zMin, // 21

        // Roof max point 
        xMax, yMax+roofMax, 0, // 22

        // Side door
        xMax, windowSize/2, zMax, // 23
        xMax, yMin+bottomOffset, zMax-door2Width, // 24
        xMax, windowSize/2, zMax-door2Width, // 25

        // Side window
        xMax, windowSize/2, 0, // 26
        xMax, -windowSize/2, 0, // 27
        xMax, windowSize/2, -windowSize, // 28
        xMax, -windowSize/2, -windowSize, // 29

        // Side Block
        // Front face
        // Side face

        -6, yMax + roofMax + 3, zMax - 3, // 30
        -6, yMax + 2, zMax - 3, // 31
        6, yMax + roofMax + 3, zMax - 3, // 32
        6, yMax + 2, zMax - 3, // 33
        6, yMax + roofMax + 3, zMax - 3 - chimneyWidth, // 34
        6, yMax + 2, zMax - 3 - chimneyWidth, // 35

        -6, yMax + roofMax + 3, zMax - 3 - 24, // 36
        -6, yMax + 2, zMax - 3 - 24, // 37
        6, yMax + roofMax + 3, zMax - 3 - 24, // 38
        6, yMax + 2, zMax - 3 - 24, // 39
        6, yMax + roofMax + 3, zMax - 3 - 30, // 40
        6, yMax + 2, zMax - 3 - 30, // 41

        // Rest of vertices for top faces
        -6, yMax + roofMax + 3, zMax - 3 - chimneyWidth, // 42
        -6, yMax + roofMax + 3, zMax - 3 - 30, // 43

    ]);

    let houseFaces = [
        // Front
        0, 1, 8,
        0, 8, 2,
        1, 9, 8,
        1, 17, 9,
        8, 14, 2,
        3, 2, 14,
        9, 17, 11,
        19, 3, 15,
        17, 16, 11,
        11, 16, 10,
        13, 12, 18,
        19, 13, 18,
        19, 15, 13,
        3, 14, 15,

        // Side
        23, 25, 2,
        25, 21, 2,
        2, 21, 22,
        24, 27, 25,
        24, 29, 27,
        24, 20, 29,
        25, 27, 26,
        25, 26, 21,
        26, 28, 21,
        20, 28, 29,
        28, 20, 21,

        // Chimney
        31, 32, 30,
        31, 33, 32,
        33, 34, 32,
        33, 35, 34,

        37, 38, 36,
        37, 39, 38,
        39, 40, 38,
        39, 41, 40,

        // top face
        32, 42, 30,
        32, 34, 42,

        38, 43, 36,
        38, 40, 43,
    ];


    // ---------------------------------- BORDERS --------------------------------- //
    let bordersVertices = new Float32Array([
        // rodape side face
        xMax, -9, 6, // 0
        xMax, yMin, 6, // 1
        xMax, -9, zMin, // 2
        xMax, yMin, zMin, // 3

        // side door borders
        xMax, 6-borderOffset, zMax-borderOffset, // 4
        xMax, yMin, zMax-borderOffset, // 5
        xMax, 6-borderOffset, zMax-borderOffset-9, // 6
        xMax, yMin, zMax-borderOffset-9, // 7

        // side window boders
        xMax, windowSize / 2 - borderOffset, - borderOffset, // 8
        xMax, - windowSize / 2 + borderOffset, - borderOffset, // 9
        xMax, windowSize / 2 - borderOffset, - windowSize + borderOffset, // 10
        xMax, - windowSize / 2 + borderOffset, - windowSize + borderOffset, // 11

        // Side door
        xMax, windowSize/2, zMax, // 12
        xMax, windowSize/2, zMax-door2Width, // 13
        xMax, yMin, zMax, // 14

        // Side window
        xMax, windowSize/2, 0, // 15
        xMax, -windowSize/2, 0, // 16
        xMax, windowSize/2, -windowSize, // 17
        xMax, -windowSize/2, -windowSize, // 18


        // FRONT FACE
        // Window 1
        -xCenterWindow-windowSize/2, windowSize / 2, zMax, // 19
        -xCenterWindow-windowSize/2, - windowSize / 2, zMax, // 20
        -xCenterWindow+windowSize/2, windowSize / 2, zMax, // 21
        -xCenterWindow+windowSize/2, - windowSize / 2, zMax, // 22

        // Window 1 inner borders
        -xCenterWindow-windowSize/2 + borderOffset, windowSize / 2 - borderOffset, zMax, // 23
        -xCenterWindow-windowSize/2 + borderOffset, - windowSize / 2 + borderOffset, zMax, // 24
        -xCenterWindow+windowSize/2 - borderOffset, windowSize / 2 - borderOffset, zMax, // 25
        -xCenterWindow+windowSize/2 - borderOffset, - windowSize / 2 + borderOffset, zMax, // 26
        
        // Window 2
        xCenterWindow-windowSize/2, windowSize / 2, zMax, // 27
        xCenterWindow-windowSize/2, - windowSize / 2, zMax, // 28
        xCenterWindow+windowSize/2, windowSize / 2, zMax, // 29
        xCenterWindow+windowSize/2, - windowSize / 2, zMax, // 30

        // Window 2 inner borders
        xCenterWindow-windowSize/2 + borderOffset, windowSize / 2 - borderOffset, zMax, // 31
        xCenterWindow-windowSize/2 + borderOffset, - windowSize / 2 + borderOffset, zMax, // 32
        xCenterWindow+windowSize/2 - borderOffset, windowSize / 2 - borderOffset, zMax, // 33
        xCenterWindow+windowSize/2 - borderOffset, - windowSize / 2 + borderOffset, zMax, // 34


        // Front Door
        -door2Width / 2, door2Width / 2, zMax, // 35
        -door2Width / 2, yMin, zMax, // 36
        door2Width / 2, door2Width / 2, zMax, // 37
        door2Width / 2, yMin, zMax, // 38

        // Front Door inner borders
        -door2Width / 2 + borderOffset, door2Width / 2 - borderOffset, zMax, // 39
        -door2Width / 2 + borderOffset, yMin, zMax, // 40
        door2Width / 2 - borderOffset, door2Width / 2 - borderOffset, zMax, // 41
        door2Width / 2 - borderOffset, yMin, zMax, // 42


        // Rodape frontal
        xMin, yMin + bottomOffset, zMax, // 43
        xMin, yMin, zMax, // 44
        -door2Width / 2, yMin + bottomOffset, zMax, // 45
        door2Width / 2, yMin + bottomOffset, zMax, // 46
        xMax, yMin + bottomOffset, zMax, // 47

    ]);


    let bordersFaces = [
        // rodape
        1, 2, 0,
        1, 3, 2,

        // door borders
        14, 5, 4,
        14, 4, 12,
        4, 13, 12,
        6, 13, 4,
        6, 1, 13,
        7, 1, 6,


        // window borders
        16, 9, 15,
        15, 9, 8,
        8, 10, 15,
        15, 10, 17,
        11, 18, 10,
        10, 18, 17,
        16, 18, 9,
        9, 18, 11,


        // FRONT FACE
        // Window 1 (left)
        20, 24, 19,
        19, 24, 23,
        20, 26, 24,
        20, 22, 26,
        26, 22, 25,
        25, 22, 21,
        19, 23, 21,
        23, 25, 21,

        // Window 2 (right)
        28, 32, 27,
        27, 32, 31,
        28, 34, 32,
        28, 30, 34,
        34, 30, 33,
        33, 30, 29,
        27, 31, 29,
        31, 33, 29,

        // Front door
        36, 40, 39,
        36, 39, 35,
        35, 39, 37,
        39, 41, 37,
        42, 38, 41,
        41, 38, 37,

        // Rodape frontal
        44, 45, 43,
        44, 40, 45,
        42, 47, 46,
        42, 14, 47,


    ];


    // ---------------------------------- ROOF --------------------------------- //

    const roofVertices = new Float32Array([

        xMax, yMax, zMax, // 0
        xMax, yMax, zMin, // 1

        xMin, yMax, zMax, // 2
        xMin, yMax, zMin, // 3

        xMax,yMax + roofMax, 0, // 4
        xMin, yMax + roofMax, 0, // 5

        // bug no 1 e no 3 :c
    ]);


    const roofFaces = [
        3, 4, 5,
        3, 1, 4,

        2, 4, 5,
        2, 0, 4,
    ]




    // ---------------------------------- DOORS --------------------------------- //

    const doorsVertices = new Float32Array([

        // Front Door inner borders
        -door2Width / 2 + borderOffset, door2Width / 2 - borderOffset, zMax, // 0
        -door2Width / 2 + borderOffset, yMin, zMax, // 1
        door2Width / 2 - borderOffset, door2Width / 2 - borderOffset, zMax, // 2
        door2Width / 2 - borderOffset, yMin, zMax, // 3

        // Side Door inner borders
        xMax, 6-borderOffset, zMax-borderOffset, // 4
        xMax, yMin, zMax-borderOffset, // 5
        xMax, 6-borderOffset, zMax-borderOffset-9, // 6
        xMax, yMin, zMax-borderOffset-9, // 7
    ]);


    const doorsFaces = [
        1, 3, 0,
        0, 3, 2,

        5, 7, 4,
        4, 7, 6,
    ]


    // ---------------------------------- WINDOWS --------------------------------- //
    const windowsVertices = new Float32Array([

        // side window boders
        xMax, windowSize / 2 - borderOffset, - borderOffset, // 0
        xMax, - windowSize / 2 + borderOffset, - borderOffset, // 1
        xMax, windowSize / 2 - borderOffset, - windowSize + borderOffset, // 2
        xMax, - windowSize / 2 + borderOffset, - windowSize + borderOffset, // 3
        // Window 1 inner borders
        -xCenterWindow-windowSize/2 + borderOffset, windowSize / 2 - borderOffset, zMax, // 4
        -xCenterWindow-windowSize/2 + borderOffset, - windowSize / 2 + borderOffset, zMax, // 5
        -xCenterWindow+windowSize/2 - borderOffset, windowSize / 2 - borderOffset, zMax, // 6
        -xCenterWindow+windowSize/2 - borderOffset, - windowSize / 2 + borderOffset, zMax, // 7
        // Window 2 inner borders
        xCenterWindow-windowSize/2 + borderOffset, windowSize / 2 - borderOffset, zMax, // 8
        xCenterWindow-windowSize/2 + borderOffset, - windowSize / 2 + borderOffset, zMax, // 9
        xCenterWindow+windowSize/2 - borderOffset, windowSize / 2 - borderOffset, zMax, // 10
        xCenterWindow+windowSize/2 - borderOffset, - windowSize / 2 + borderOffset, zMax, // 11

    ]);
        

    const windowsFaces = [
        0, 1, 2,
        1, 3, 2,

        4, 5, 6,
        5, 7, 6,

        8, 9, 10,
        9, 11, 10,
    ]


    // -------------------------------- CREATE BUFFER GEOMETRY ------------------------------- //

    // ---------------------------------- HOUSE --------------------------------- //
    // Create a BufferGeometry for the house
    const houseGeometry = new THREE.BufferGeometry();
    houseGeometry.setIndex(houseFaces);
    houseGeometry.setAttribute( 'position', new THREE.BufferAttribute( houseVertices, 3 ) );
    houseGeometry.computeVertexNormals();

    // Create a mesh for the house
    houseMesh = new THREE.Mesh(houseGeometry, HouseMaterials[HouseParts.HOUSE]);
    scene.add(houseMesh);
    houseMesh.position.y = 55;


    // ---------------------------------- BORDERS --------------------------------- //
    // Create a BufferGeometry for the borders
    const bordersGeometry = new THREE.BufferGeometry();
    bordersGeometry.setIndex(bordersFaces);
    bordersGeometry.setAttribute( 'position', new THREE.BufferAttribute( bordersVertices, 3 ) );
    bordersGeometry.computeVertexNormals();
        
    // Create a mesh for the borders
    borderMesh = new THREE.Mesh(bordersGeometry, HouseMaterials[HouseParts.BORDERS]);
    scene.add(borderMesh);
    borderMesh.position.y = 55;


    // ---------------------------------- ROOF --------------------------------- //
    // Create a BufferGeometry for the roof
    const roofGeometry = new THREE.BufferGeometry();
    roofGeometry.setIndex(roofFaces);
    roofGeometry.setAttribute( 'position', new THREE.BufferAttribute( roofVertices, 3 ) );
    roofGeometry.computeVertexNormals();
        
    // Create a mesh for the roof
    roofMesh = new THREE.Mesh(roofGeometry, HouseMaterials[HouseParts.ROOF]);
    scene.add(roofMesh);
    roofMesh.position.y = 55;


    // ---------------------------------- DOORS --------------------------------- //
    // Create a BufferGeometry for the doors
    const doorsGeometry = new THREE.BufferGeometry();
    doorsGeometry.setIndex(doorsFaces);
    doorsGeometry.setAttribute( 'position', new THREE.BufferAttribute( doorsVertices, 3 ) );
    doorsGeometry.computeVertexNormals();
        
    // Create a mesh for the doors
    doorsMesh = new THREE.Mesh(doorsGeometry, HouseMaterials[HouseParts.DOORS]);
    scene.add(doorsMesh);
    doorsMesh.position.y = 55;

    // ---------------------------------- WINDOWS --------------------------------- //
        // Create a BufferGeometry for the doors
    const windowsGeometry = new THREE.BufferGeometry();
    windowsGeometry.setIndex(windowsFaces);
    windowsGeometry.setAttribute( 'position', new THREE.BufferAttribute( windowsVertices, 3 ) );
    windowsGeometry.computeVertexNormals();
        
    // Create a mesh for the doors
    windowsMesh = new THREE.Mesh(windowsGeometry, HouseMaterials[HouseParts.WINDOWS]);
    scene.add(windowsMesh);
    windowsMesh.position.y = 55;
}


export { addHouse, xMin, xMax, zMin, zMax, houseMesh, borderMesh, roofMesh, doorsMesh, windowsMesh};
