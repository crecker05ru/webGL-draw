import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

console.log('VITE WORK')
const heightInput = document.createElement('input')
const radiusInput = document.createElement('input')
const segmentsNumber = document.createElement('input')
heightInput.placeholder = 'Height'
radiusInput.placeholder = 'Radius'
segmentsNumber.placeholder = 'Number of segments'
document.body.append(heightInput,radiusInput,segmentsNumber)
const width = 900
const height = 600
const renderer = new THREE.WebGLRenderer()
renderer.setSize(width,height)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  width/ height,
  0.1,
  1000
)

const orbit = new OrbitControls(camera, renderer.domElement)
const axesHelper = new THREE.AxesHelper(3)
const gridHelper = new THREE.GridHelper()
scene.add(axesHelper)
scene.add(gridHelper)
camera.position.set(5,3,5)
orbit.update()

const boxGeometry = new THREE.BoxGeometry()
const boxMaterial = new THREE.MeshBasicMaterial({color: 0xffaaff})
const box = new THREE.Mesh(boxGeometry,boxMaterial)
scene.add(box)


const geometry = new THREE.ConeGeometry( 1, 3, 64 ); 
const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
const cone = new THREE.Mesh(geometry, material ); 
scene.add( cone );

// const triangleGeometry = new THREE.Triangle(1,1,1)
// const triangleMaterial = new THREE.MeshBasicMaterial({color: 0xaabbaa})
// const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial)
// scene.add(triangle)
// scene.add(triangleGeometry)

// const triangleGeometry = new THREE.geometry()
// const v1 = new THREE.Vector3(0,0,0)
// const v2 = new THREE.Vector3(30,0,0)
// const v3 = new THREE.Vector3(30,30,0)
// const triangle = new THREE.Triangle(v1,v2,v3)
// const normal = triangle.normal()
// triangleGeometry.vertices.push(triangle.a)
// triangleGeometry.vertices.push(triangle.b)
// triangleGeometry.vertices.push(triangle.c)
// triangleGeometry.faces.push(new THREE.Face3(0,1,2, normal))
// const mesh = new THREE.Mesh(geom, new THREE.MeshNormalMaterial());
// scene.add(mesh);
const a = new THREE.Vector3(0.5,0,1)
const b = new THREE.Vector3(1,0,0)
const c = new THREE.Vector3(0,5,0)
// const triangleGeometry = new THREE.Triangle(a,b,c)
// const triangleMaterial = new THREE.MeshBasicMaterial({color: 0xaabbaa})
// const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial)
// scene.add(triangle)

const triangleGeometry = new THREE.BufferGeometry().setFromPoints([a, b, c]);
const triangleMaterial = new THREE.MeshBasicMaterial({color: 0xffbbaa,side: THREE.DoubleSide})
const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial)
scene.add(triangle)

const animate = (time) => {
  box.rotation.x = time/ 1000
  box.rotation.y = time / 1000
  box.rotation.z = time / 1000
  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
