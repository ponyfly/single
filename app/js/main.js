import $ from 'jquery'
import 'babel-polyfill'
import arr from './greeter'
import '../css/reset.css'
import '../css/main.css'

$('h1').css({backgroundColor: '#fa0'})

const box2 = $('.box2')
class Dog {
  constructor(name){
    this.name = name
  }
  sayName(){
    return this.name
  }
}

const promise = new Promise((resolve, reject) => {
  resolve('resolve')
})

promise.then(res => console.log(res)).catch(err => console.log(err.message))
const dog = new Dog('旺财2fdafdsfdafasdfsasfasf')
const dogName = dog.sayName()
$('button').on('click', function () {
  box2.text(dogName)
})

console.log(arr);