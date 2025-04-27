/////////////////////////////////////////////////////////////////////////
///// IMPORT
import './main.css'
import { Clock, Scene, LoadingManager, WebGLRenderer, sRGBEncoding, Group, PerspectiveCamera, DirectionalLight, PointLight, MeshPhongMaterial } from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/////////////////////////////////////////////////////////////////////////
//// LOADING MANAGER
const ftsLoader = document.querySelector(".lds-roller")
const looadingCover = document.getElementById("loading-text-intro")
const loadingManager = new LoadingManager()

loadingManager.onLoad = function() {

    document.querySelector(".main-container").style.visibility = 'visible'
    document.querySelector("body").style.overflow = 'auto'

    const yPosition = {y: 0}
    
    new TWEEN.Tween(yPosition).to({y: 100}, 900).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onUpdate(function(){ looadingCover.style.setProperty('transform', `translate( 0, ${yPosition.y}%)`)})
    .onComplete(function () {looadingCover.parentNode.removeChild(document.getElementById("loading-text-intro")); TWEEN.remove(this)})

    introAnimation()
    ftsLoader.parentNode.removeChild(ftsLoader)

    window.scroll(0, 0)

}

/////////////////////////////////////////////////////////////////////////
//// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
dracoLoader.setDecoderConfig({ type: 'js' })
const loader = new GLTFLoader(loadingManager)
loader.setDRACOLoader(dracoLoader)

/////////////////////////////////////////////////////////////////////////
///// DIV CONTAINER CREATION TO HOLD THREEJS EXPERIENCE
const container = document.getElementById('canvas-container')
const containerDetails = document.getElementById('canvas-container-details')

/////////////////////////////////////////////////////////////////////////
///// GENERAL VARIABLES
let oldMaterial
let secondContainer = false
let width = container.clientWidth
let height = container.clientHeight

/////////////////////////////////////////////////////////////////////////
///// SCENE CREATION
const scene = new Scene()

/////////////////////////////////////////////////////////////////////////
///// RENDERER CONFIG
const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance"})
renderer.autoClear = true
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
renderer.setSize( width, height)
renderer.outputEncoding = sRGBEncoding
container.appendChild(renderer.domElement)

const renderer2 = new WebGLRenderer({ antialias: false})
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1))
renderer2.setSize( width, height)
renderer2.outputEncoding = sRGBEncoding
containerDetails.appendChild(renderer2.domElement)

/////////////////////////////////////////////////////////////////////////
///// CAMERAS CONFIG
const cameraGroup = new Group()
scene.add(cameraGroup)

const camera = new PerspectiveCamera(35, width / height, 1, 100)
camera.position.set(19,1.54,-0.1)
cameraGroup.add(camera)

const camera2 = new PerspectiveCamera(35, containerDetails.clientWidth / containerDetails.clientHeight, 1, 100)
camera2.position.set(1.9,1.7,1.2)
camera2.rotation.set(0,1.1,0)
scene.add(camera2)

/////////////////////////////////////////////////////////////////////////
///// MAKE EXPERIENCE FULL SCREEN
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    
    camera2.aspect = containerDetails.clientWidth / containerDetails.clientHeight
    camera2.updateProjectionMatrix()

    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer2.setSize(containerDetails.clientWidth, containerDetails.clientHeight)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1))
})

/////////////////////////////////////////////////////////////////////////
///// SCENE LIGHTS
const sunLight = new DirectionalLight(0xffffff, 0.1)
sunLight.position.set(1,1,1)
scene.add(sunLight)


const fillLight = new PointLight(0xffffff, 2, 2, 1.5)
// const sunLight = new DirectionalLight(0xffffff, 0.01)
// sunLight.position.set(1,1,1)
// scene.add(sunLight)
// const fillLight = new PointLight(0xffffff, 7, 1.6, 1.5)
// 0x88b2d9
fillLight.position.set(30,3,1)
scene.add(fillLight)

/////////////////////////////////////////////////////////////////////////
///// LOADING GLB/GLTF MODEL FROM BLENDER
loader.load('models/gltf/bitchboy1.glb', function (gltf) {

    gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
            oldMaterial = obj.material
            // obj.material = new MeshPhongMaterial({
            //     shininess: 45 
            // })
        }
    })
    
    scene.add(gltf.scene)
    clearScene()
})

function clearScene(){
    oldMaterial.dispose()
    renderer.renderLists.dispose()
}

/////////////////////////////////////////////////////////////////////////
//// INTRO CAMERA ANIMATION USING TWEEN
// function introAnimation() {
//     new TWEEN.Tween(camera.position.set(0,4,2.7)).to({ x: 0, y: 1.4, z: 8.8}, 3500).easing(TWEEN.Easing.Quadratic.InOut).start()
//     .onComplete(function () {
//         TWEEN.remove(this)
//         document.querySelector('.header').classList.add('ended')
//         document.querySelector('.first>p').classList.add('ended')
//     })
    
// }
function introAnimation() {
    const mobileBreakpoint = 660; // Define the mobile breakpoint

    // Determine if the current device is mobile
    const isMobile = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`).matches;

    // Choose the appropriate camera animation based on the device
    const targetPosition = isMobile ? { x: 0, y: 1.4, z: 14.8 } : { x: 0, y: 1.4, z: 8.8 };
    
    new TWEEN.Tween(camera.position.set(0, 4, 2.7))
        .to(targetPosition, 3500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
        .onComplete(function () {
            TWEEN.remove(this);
            document.querySelector('.header').classList.add('ended');
            // document.querySelector('.first>p').classList.add('ended');
        });
}
//////////////////////////////////////////////////
//// CLICK LISTENERS
document.getElementById('our goal').addEventListener('click', () => {
    document.getElementById('our goal').classList.add('active')
    // document.getElementById('euphre').classList.remove('active')
    document.getElementById('features').classList.remove('active')
    document.getElementById('content').innerHTML = 'At this stage the goal is to share the development of BitchBoy with VJs in order to get a feel of the general interest behind the project. <br> The greater the response the higher the chances of it coming to life so if you are a VJ and you think this is cool, you BETTER share 🫵.<br><br> On a technical level, our goal is to inspire beginner to intermediate VJs which is why BitchBoy comes bundled with a project template and default mappings for Resolume Arena.<br><br> Wanna get even MORE technical? Check the Features. ➡️ '
    animateCamera({ x: 1.9, y: 1.7, z: 1.2 },{ y: 1.1 })
})

document.getElementById('features').addEventListener('click', () => {
    document.getElementById('features').classList.add('active')
    document.getElementById('our goal').classList.remove('active')
    // document.getElementById('euphre').classList.remove('active')
    document.getElementById('content').innerHTML = 'We ain\'t gonna sugarcoat it, here\'s every input on the BitchBoy: <br> <b> BOOM </b> a 10 x 5 button grid <br> <b> BOOM </b> 10 vertical faders <br> <b> BOOM </b> 4 horizontal faders <br> <b> BOOM </b> 5 functionality buttons <br> <b> BOOM </b> a d-pad <br> <b> BOOM </b> 12 encoders <br> <b> BOOM </b> a screen <br> <b> BOOM </b> a mousepad <br> Visual feedback is also a key feature, so expect a lot of LEDs and tags. <br> Size is made to fit in a backpack, for all you traveling folks. <br> <i> Note: This is still an early prototype, so expect changes. </i> '
    animateCamera({ x: -2, y: 1.7, z: 2.2 },{ y: -0.6 })
})

// document.getElementById('euphre').addEventListener('click', () => {
//     document.getElementById('euphre').classList.add('active')
//     document.getElementById('our goal').classList.remove('active')
//     document.getElementById('features').classList.remove('active')
//     document.getElementById('content').innerHTML = 'Euphrosyne is a Goddess of Good Cheer, Joy and Mirth. Her name is the female version of a Greek word euphrosynos, which means "merriment". The Greek poet Pindar states that these goddesses were created to fill the world with pleasant moments and good will. Usually the Charites attended the goddess of beauty Aphrodite.'
//     animateCamera({ x: -0.4, y: 1.7, z: 1.9 },{ y: -0.6 })
// })

/////////////////////////////////////////////////////////////////////////
//// ANIMATE CAMERA
function animateCamera(position, rotation){
    new TWEEN.Tween(camera2.position).to(position, 1800).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onComplete(function () {
        TWEEN.remove(this)
    })
    new TWEEN.Tween(camera2.rotation).to(rotation, 1800).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onComplete(function () {
        TWEEN.remove(this)
    })
}

/////////////////////////////////////////////////////////////////////////
//// PARALLAX CONFIG
const cursor = {x:0, y:0}
const clock = new Clock()
let previousTime = 0

/////////////////////////////////////////////////////////////////////////
//// RENDER LOOP FUNCTION

function rendeLoop() {

    TWEEN.update()

    if (secondContainer){
        renderer2.render(scene, camera2)
    } else{
        renderer.render(scene, camera)
    }

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    const parallaxY = cursor.y
    fillLight.position.y -= ( parallaxY *9 + fillLight.position.y -2) * deltaTime

    const parallaxX = cursor.x
    fillLight.position.x += (parallaxX *8 - fillLight.position.x) * 2 * deltaTime

    cameraGroup.position.z -= (parallaxY/3 + cameraGroup.position.z) * 2 * deltaTime
    cameraGroup.position.x += (parallaxX/3 - cameraGroup.position.x) * 2 * deltaTime

    requestAnimationFrame(rendeLoop)
}

rendeLoop()

//////////////////////////////////////////////////
//// ON MOUSE MOVE TO GET CAMERA POSITION
document.addEventListener('mousemove', (event) => {
    event.preventDefault()

    cursor.x = event.clientX / window.innerWidth -0.5
    cursor.y = event.clientY / window.innerHeight -0.5

    handleCursor(event)
}, false)

//////////////////////////////////////////////////
//// DISABLE RENDERER BASED ON CONTAINER VIEW
const watchedSection = document.querySelector('.second')

function obCallback(payload) {
    if (payload[0].intersectionRatio > 0.05){
        secondContainer = true
    }else{
        secondContainer = false
    }
}

const ob = new IntersectionObserver(obCallback, {
    threshold: 0.05
})

ob.observe(watchedSection)

//////////////////////////////////////////////////
//// MAGNETIC MENU
const btn = document.querySelectorAll('nav > .a')
const customCursor = document.querySelector('.cursor')

function update(e) {
    const span = this.querySelector('span')
    
    if(e.type === 'mouseleave') {
        span.style.cssText = ''
    } else {
        const { offsetX: x, offsetY: y } = e,{ offsetWidth: width, offsetHeight: height } = this,
        walk = 20, xWalk = (x / width) * (walk * 2) - walk, yWalk = (y / height) * (walk * 2) - walk
        span.style.cssText = `transform: translate(${xWalk}px, ${yWalk}px);`
    }
}

const handleCursor = (e) => {
    const x = e.clientX
    const y =  e.clientY
    customCursor.style.cssText =`left: ${x}px; top: ${y}px;`
}

btn.forEach(b => b.addEventListener('mousemove', update))
btn.forEach(b => b.addEventListener('mouseleave', update))


// Clear the stored value each time the page is loaded
window.onload = function() {
    localStorage.removeItem('win95-popup-closed');
};

// Show the popup when the user scrolls down a bit, but only if it hasn't been closed in the current session
window.addEventListener('scroll', function() {
    const popup = document.getElementById('win95-popup');
    const scrollThreshold = 400; // Trigger popup after 300px of scrolling

    if (window.scrollY > scrollThreshold && !localStorage.getItem('win95-popup-closed')) {
        popup.style.display = 'block';
    }
});

// Close the popup when the close button is clicked and store the preference in localStorage
document.getElementById('win95-close').addEventListener('click', function() {
    document.getElementById('win95-popup').style.display = 'none';
    localStorage.setItem('win95-popup-closed', 'true');
});

// Handle form submission
document.getElementById('win95-email-signup-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('win95-email').value;

    if (email) {
        // Simulate sending email (replace with your actual API call)
        fetch('https://script.google.com/macros/s/AKfycbzlood_krfdSl1DT18y-XDEEbxmrJBn_SY1EpAMELK0fOGYfThz1sT7iw5Ilf3vxrY/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'email=' + encodeURIComponent(email)
        })
        .then(response => response.text())
        .then(data => {
            // Clear only the form and show the thank you message
            document.querySelector('.win95-content').innerHTML = '<p id="win95-form-response">Thank you for signing up!</p>';
            console.log('Form submission successful. Thank you message displayed.');
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector('#win95-form-response').innerText = 'Error sending email.';
        });
    } else {
        document.querySelector('#win95-form-response').innerText = 'Please enter a valid email.';
    }
});

//arrow 
document.addEventListener('scroll', function() {
    const scrollDownArrow = document.querySelector('.scroll-down-arrow');
    if (window.scrollY > 50) { // Adjust the scroll threshold as needed
        scrollDownArrow.style.display = 'none';
    }
});

// document.querySelector('.scroll-down-arrow').addEventListener('click', function() {
//     window.scrollTo({
//         top: window.innerHeight,
//         behavior: 'smooth'
//     });
// });

// Function to handle the display of the Windows 95-style signup container
// function handleSignupContainerVisibility() {
//     const signupContainer = document.getElementById('win95-signup-container');
    
//     // Function to check if the user has scrolled to the bottom
//     function checkScrollPosition() {
//         const windowHeight = window.innerHeight;
//         const fullHeight = document.documentElement.scrollHeight;
//         const scrolled = window.scrollY + windowHeight;

//         // Show the container if the user is at the bottom of the page
//         if (scrolled >= fullHeight - 50) {
//             signupContainer.style.transform = 'translateY(0)';
//         } else {
//             signupContainer.style.transform = 'translateY(100%)';
//         }
//     }

//     // Attach the scroll event listener to check the scroll position
//     window.addEventListener('scroll', checkScrollPosition);
// }

// // Call the function to handle the visibility of the signup container
// handleSignupContainerVisibility();

// // Handle form submission
// document.getElementById('win95-email-signup-form').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const email = document.getElementById('win95-email').value;

//     if (email) {
//         // Simulate sending email (replace with your actual API call)
//         fetch('https://script.google.com/macros/s/AKfycbzlood_krfdSl1DT18y-XDEEbxmrJBn_SY1EpAMELK0fOGYfThz1sT7iw5Ilf3vxrY/exec', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: 'email=' + encodeURIComponent(email)
//         })
//         .then(response => response.text())
//         .then(data => {
//             // Clear the form and show the thank you message
//             document.getElementById('win95-email-signup-form').reset();
//             document.getElementById('win95-form-response').innerText = 'Thank you for signing up!';
//             document.getElementById('win95-form-response').style.display = 'block';
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             document.getElementById('win95-form-response').innerText = 'Error sending email.';
//             document.getElementById('win95-form-response').style.display = 'block';
//         });
//     } else {
//         document.getElementById('win95-form-response').innerText = 'Please enter a valid email.';
//         document.getElementById('win95-form-response').style.display = 'block';
//     }
// });

