import * as THREE from 'three';

function checkOverlap(circles, length, new_circle) {
    for (var i = 0; i < length; i++) {
        let circle = circles[i];
        let dx = circle[0] - new_circle[0];
        let dy = circle[1] - new_circle[1];
        if (dx*dx + dy*dy <= (circle[2] + new_circle[2])*(circle[2] + new_circle[2])) {
            return true;
        }
    }
    return false;
}


function floralCamp(numberOfFlowers) {
    'use strict';

    const radius_limits = [.5, 1.1];
    const padding = radius_limits[0] + radius_limits[1];
    const backgroundColour = 'rgb(111, 170, 128)';
    const flowerColours = [
        'rgb(236, 236, 236)', // white
        'rgb(238, 255, 0)', // yellow
        'rgb(200, 162, 200)', // lilac
        'rgb(0, 169, 236)', // lightblue
    ]
    const circles = new Array(numberOfFlowers);

    var canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    var context = canvas.getContext('2d');

    context.fillStyle = backgroundColour;
    context.fillRect(0, 0, canvas.width, canvas.height);


    for (var i = 0; i < numberOfFlowers; i++) {
        let flowerColour = flowerColours[Math.floor(Math.random() * flowerColours.length)];
        let flowerSize = Math.random()*(radius_limits[1]-radius_limits[0]) + radius_limits[0];
        let flowerX = Math.random() * (canvas.width - padding * 2) + padding;
        let flowerY = Math.random() * (canvas.height - padding * 2) + padding;

        if (checkOverlap(circles, i, [flowerX, flowerY, flowerSize])) {
            i--;
            continue;
        }

        context.beginPath();
        context.arc(flowerX, flowerY, flowerSize, 0, 2 * Math.PI);
        context.fillStyle = flowerColour;
        context.fill();
        context.closePath();

        circles[i] = [flowerX, flowerY, flowerSize]
    }

    return new THREE.CanvasTexture(canvas);
}

function starrySky(numberOfStars) {
    'use strict';

    const backgroundColourUp = 'rgb(31, 1, 49)';
    const backgroundColourDown = 'rgb(2, 3, 77)';
    const starColour = 'rgb(252, 255, 221)';
    const radius_limits = [0.5, 1.5];
    const padding = radius_limits[0]+radius_limits[1];
    const circles = new Array(numberOfStars);

    var canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 4096;

    var context = canvas.getContext('2d');
    var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, backgroundColourUp);
    gradient.addColorStop(1, backgroundColourDown);
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < numberOfStars; i++) {
        let starSize = Math.random()*(radius_limits[1]-radius_limits[0]) + radius_limits[0];
        let starX = Math.random() * (canvas.width - padding * 2) + padding;
        let starY = Math.random() * (canvas.height - padding * 2) + padding;

        if (checkOverlap(circles, i, [starX, starY, starSize])) {
            i--;
            continue;
        }

        context.beginPath();
        context.arc(starX, starY, starSize, 0, 2 * Math.PI);
        context.fillStyle = starColour;
        context.fill();
        context.closePath();

        circles[i] = [starX, starY, starSize]
    }

    return new THREE.CanvasTexture(canvas);
}

export { 
    floralCamp,
    starrySky,
};