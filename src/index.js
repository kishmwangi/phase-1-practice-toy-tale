let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

  // Fetch Andy's Toys
  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => toys.forEach(renderToy))
      .catch(error => console.error('Error fetching toys:', error));
  }

  // Render Toy Card
  function renderToy(toy) {
    const card = document.createElement('div');
    card.className = 'card';

    const name = document.createElement('h2');
    name.textContent = toy.name;

    const image = document.createElement('img');
    image.src = toy.image;
    image.className = 'toy-avatar';

    const likes = document.createElement('p');
    likes.textContent = `${toy.likes} Likes`;

    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';
    likeBtn.id = toy.id;
    likeBtn.textContent = 'Like ❤️';

    likeBtn.addEventListener('click', () => {
      increaseLikes(toy);
    });

    card.appendChild(name);
    card.appendChild(image);
    card.appendChild(likes);
    card.appendChild(likeBtn);

    toyCollection.appendChild(card);
  }

  // Add New Toy
  toyForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(toyForm);
    const name = formData.get('name');
    const image = formData.get('image');

    const newToy = {
      name,
      image,
      likes: 0
    };

    addNewToy(newToy);
  });

  function addNewToy(toy) {
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(toy)
    })
      .then(response => response.json())
      .then(renderToy)
      .catch(error => console.error('Error adding new toy:', error));
  }

  // Increase a Toy's Likes
  function increaseLikes(toy) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
      .then(response => response.json())
      .then(updatedToy => {
        const toyCard = document.getElementById(updatedToy.id);
        const likesElement = toyCard.querySelector('p');
        likesElement.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error('Error increasing likes:', error));
  }

  // Initialize
  fetchToys();