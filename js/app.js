'use strict';

const names = [
  'bag.jpg',
  'banana.jpg',
  'bathroom.jpg',
  'boots.jpg',
  'breakfast.jpg',
  'bubblegum.jpg',
  'chair.jpg',
  'cthulhu.jpg',
  'dog-duck.jpg',
  'dragon.jpg',
  'pen.jpg',
  'pet-sweep.jpg',
  'scissors.jpg',
  'shark.jpg',
  'sweep.png',
  'tauntaun.jpg',
  'unicorn.jpg',
  'usb.gif',
  'water-can.jpg',
  'wine-glass.jpg',
];

const leftImage = document.getElementById('left-image');
const centerImage = document.getElementById('center-image');
const rightImage = document.getElementById('right-image');
const imagesSection = document.getElementById('images-section');
let start = 0;
var prodList = [];
let rounds = 0;
const maxRounds = 7;
attachProductsListeners();

function attachProductsListeners() {
  leftImage.addEventListener('click', voteEvent);
  centerImage.addEventListener('click', voteEvent);
  rightImage.addEventListener('click', voteEvent);
}

function voteEvent(event) {
  vote(event.target.idx);
}
function detachProductsListeners() {
  leftImage.removeEventListener('click', voteEvent);
  centerImage.removeEventListener('click', voteEvent);
  rightImage.removeEventListener('click', voteEvent);
}

function Product(name) {
  this.name = name.split('.')[0];
  this.path = `img/assets/${name}`;
  this.votes = 0;
  this.views = 0;
}


const allProducts = [];
for (let i = 0; i < names.length; i++) {
  allProducts.push(new Product(names[i]));

}

function render() {
  const leftIndex = start % allProducts.length;
  const midIndex = (start + 1) % allProducts.length;
  const rightIndex = (start + 2) % allProducts.length;
  leftImage.src = allProducts[leftIndex].path;
  centerImage.src = allProducts[midIndex].path;
  rightImage.src = allProducts[rightIndex].path;
  leftImage.idx = 0;
  centerImage.idx = 1;
  rightImage.idx = 2;
  prodList[0] = allProducts[leftIndex];
  prodList[1] = allProducts[midIndex];
  prodList[2] = allProducts[rightIndex];
  prodList.forEach((prod) => prod.views++);

}
function nextPage() {
  start += 3;
}

render();


function vote(idx) {

  prodList[idx].votes = prodList[idx].votes + 1;
  nextPage();
  render();
  rounds++;
  if (rounds >= maxRounds) {
    detachProductsListeners();
    let results =viewResults();
    createChart(results);
    alert('your max number of rounds has finished');
  }


}

function viewResults() {
  let result = document.getElementById('result');
  let allProdsString = localStorage.getItem('allProds');
  let resultProds = [];
  if (allProdsString) {
    let allProds = JSON.parse(allProdsString);
    for (let i = 0; i < allProds.length; i++) {
      let product = new Product(allProds[i].name);
      product.views = allProds[i].views + allProducts[i].views;
      product.votes = allProds[i].votes + allProducts[i].votes;
      resultProds.push(product);
    }
  } else {
    resultProds = allProducts;
  }

  for (let i = 0; i < resultProds.length; i++) {
    let prod = resultProds[i];
    var li = document.createElement('li');
    li.innerText = `${prod.name} had ${prod.votes} votes, and was seen ${prod.views} times.`;
    result.appendChild(li);
  }

  localStorage.setItem('allProds', JSON.stringify(resultProds));
  return resultProds;
}

// add chart 

let productsVotes =[];

function createChart(product){

  const ctx = document.getElementById('myChart').getContext('2d');

  for (let i=0; i< product.length;i++){
    let votes=product[i].votes;
    productsVotes.push(votes);
  }

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: names,
      datasets: [{
        label: 'Voting Chart',
        backgroundColor: 'brown',
        borderColor: 'white',
        data: productsVotes,
      }]
    },
  });
}
