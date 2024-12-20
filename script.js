// constants 
const imageWrapper = document.querySelector(".images")
const loadmoreBtn  = document.querySelector(".load-more")
const searchInput  = document.querySelector(".search-box input")
const imageBox  = document.querySelector(".imgBox")
const hideBtn  = imageBox.querySelector(".uil-times")
const downloadImageBtn  = imageBox.querySelector(".uil-import")


const apiKey = "P0aNhvlaPWf03ppTRjr5h3uUZyamQ5mvB2D0k4Lu4gklr9QGvezJuWvi";
const perPage = 15; //no images per page
let currentPage = 1; //increase no of page to load more

let searchTerm = null;

// const baseURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`

const downloadImage = (imageURL) => {
    fetch(imageURL)
    .then(response => response.blob())
    .then(file => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file)
        link.download = new Date().getTime();
        link.click();
    }).catch(() => alert('Download failed'))
}

const viewImage = (image, photographer) => {
    imageBox.querySelector('img').src = image;
    imageBox.querySelector('span').innerText = photographer;
    imageBox.classList.add('view');
    document.body.style.overflow = "hidden";

    downloadImageBtn.setAttribute("data-img", image)
}

const hideImageBox = () => {
    imageBox.classList.remove('view');
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    imageWrapper.innerHTML += images.map(img =>
        
        `       
            <li class="image-card" onclick = "viewImage('${img.src.large2x}', '${img.photographer}')">
                <img src="${img.src.large2x}" alt="image">
                <div class="image-details">
                    <div class="photographer">
                        <i class="uil uil-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button onclick = "downloadImage('${img.src.large2x}');event.stopPropagation();"> 
                        <i class="uil uil-import"></i>
                    </button>
                </div>
            </li>`
            // stopPropagation() prevents same event being called
    ).join("");
}

const getImages = (baseURL) => {
    loadmoreBtn.innerText = "Loading...";
    loadmoreBtn.classList.add("disabled");

    fetch(baseURL, {
        headers: {Authorization: apiKey}
    }).then(response => response.json()).then(data => {
        // console.log(data);
        generateHTML(data.photos);

        loadmoreBtn.innerText = "Load More";
        loadmoreBtn.classList.remove("disabled");

    })
}

const loadMoreImages = () => {
    currentPage++;
    // let baseURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    baseURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`: `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    getImages(baseURL);
}

const loadSearchedImages = (e) => {
    if(e.key === "Enter"){
        // console.log("pressed enter");
        currentPage = 1;
        searchTerm = e.target.value;
        imageWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
    }
}

 getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
 loadmoreBtn.addEventListener('click', loadMoreImages);
 searchInput.addEventListener('keyup', loadSearchedImages);
 hideBtn.addEventListener('click', hideImageBox);
 downloadImageBtn.addEventListener('click', (e) => downloadImage(e.target.dataset.image))
