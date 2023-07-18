
var trailer_dimensions = {
    wheel: {
        r: 2.25,
        y: 2
    },

    container: {
        x: 14,
        y: 19,
        z: 40
    },

    hook: {
        x: 1,
        y: 2,
        z: 1
    },

    support: {
        x: 4,
        y: 4,
        z: 3
    },

    wheel_support: {
        x: 10,
        y: 4.5,
        z: 5.5
    },
}

var trailer_box_dimensions = {
    box: {
        x: trailer_dimensions.container.x,
        y: trailer_dimensions.container.y + trailer_dimensions.wheel_support.y + trailer_dimensions.wheel.r,
        z: trailer_dimensions.container.z
    }
}


function regularCylinderGeometry(radius, height) {
    'use strict';

    return new THREE.CylinderGeometry(radius, radius, height, 32);
}

function createWheel() {
    'use strict';

    let dim = trailer_dimensions.wheel;
    var wheel = new THREE.Mesh(regularCylinderGeometry(dim.r, dim.y), materials[3]);
    wheel.rotation.z = Math.PI / 2;

    return wheel;
}

function createContainer() {
    'use strict';

    let dim = trailer_dimensions.container;
    var container = new THREE.Mesh(new THREE.BoxGeometry(dim.x, dim.y, dim.z), materials[1]);

    return container;
}

function createHook() {
    'use strict';

    let dim = trailer_dimensions.hook;
    var hook = new THREE.Mesh(new THREE.BoxGeometry(dim.x, dim.y, dim.z), materials[1]);

    return hook;
}

function createSupport() {
    'use strict';

    let dim = trailer_dimensions.support;
    var support = new THREE.Mesh(new THREE.BoxGeometry(dim.x, dim.y, dim.z), materials[0]);

    return support;
}

function createWheelSupport() {
    'use strict';

    let dim = trailer_dimensions.wheel_support;
    var wheel_support = new THREE.Mesh(new THREE.BoxGeometry(dim.x, dim.y, dim.z), materials[0]);

    return wheel_support;
}

function createTrailer() {
    'use strict';

    let trailer = new THREE.Object3D();

    trailer.userData = {
        movVecPos: new THREE.Vector3(0, 0, 0),
        movVecNeg: new THREE.Vector3(0, 0, 0),
        isMovingToTarget: false
    }

    //CREATE CONTAINER
    let container = createContainer();
    container.position.set(0, trailer_dimensions.container.y / 2, 0);
    //

    //CREATE WHEELS
    let wheel_support = createWheelSupport();

    let r1wheel = createWheel();
    r1wheel.position.set(trailer_dimensions.wheel_support.x / 2 + trailer_dimensions.wheel.y / 2, -trailer_dimensions.wheel_support.y / 2, trailer_dimensions.wheel_support.z / 2)
    wheel_support.add(r1wheel);

    let r2wheel = createWheel();
    r2wheel.position.set(trailer_dimensions.wheel_support.x / 2 + trailer_dimensions.wheel.y / 2, -trailer_dimensions.wheel_support.y / 2, -trailer_dimensions.wheel_support.z / 2)
    wheel_support.add(r2wheel);

    let l1wheel = createWheel();
    l1wheel.position.set(-(trailer_dimensions.wheel_support.x / 2 + trailer_dimensions.wheel.y / 2), -trailer_dimensions.wheel_support.y / 2, trailer_dimensions.wheel_support.z / 2)
    wheel_support.add(l1wheel);

    let l2wheel = createWheel();
    l2wheel.position.set(-(trailer_dimensions.wheel_support.x / 2 + trailer_dimensions.wheel.y / 2), -trailer_dimensions.wheel_support.y / 2, -trailer_dimensions.wheel_support.z / 2)
    wheel_support.add(l2wheel);

    wheel_support.position.set(0, -(trailer_dimensions.container.y / 2 + trailer_dimensions.wheel_support.y / 2), -(trailer_dimensions.container.z / 2 - trailer_dimensions.wheel_support.z / 2 - trailer_dimensions.wheel.r - 0.5));
    //


    //CREATE HOOK
    let hook = createHook();
    hook.position.set(0, -trailer_dimensions.container.y / 2 - trailer_dimensions.hook.y / 2, trailer_dimensions.container.z / 2 - trailer_dimensions.hook.z / 2 - 4);
    //

    //JOIN PIECES    
    container.add(hook);
    container.add(wheel_support);


    trailer.add(container);


    return trailer;

}

function createTrailerBox() {
    'use strict';


    var box = new THREE.Mesh(new THREE.BoxGeometry(trailer_box_dimensions.box.x + offset,
        trailer_box_dimensions.box.y + offset,
        trailer_box_dimensions.box.z + offset),
        materials[4]);

    return box
}

function moveToTarget(x, y, z) {
    'use strict';
    var targetVec = new THREE.Vector3();
    targetVec.x = x - trailer.position.x;
    targetVec.y = 0;
    targetVec.z = z - trailer.position.z;
    return targetVec;
}

