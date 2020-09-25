//The default start index
const defaultStartIndex = 0;

//The maximum results returned per page
const defaultMaxResults = 10;

//The default page number to begin from
const defaultPageNumber = 1;


/**
 * Universal Function that handles the submission of data 
 * @param  {[object]} event [description]
 * @param  {[string]} param [the URL query parameter value]
 */
const start = function(event, param = null, pageNumber, startIndex = defaultStartIndex, maxResults){


	let search_content = null;
	if(event){
		// /event.preventDefault();// Not preventing the default behaviour
		search_content = (event.type == 'submit') ? this.search_contents.value.trim() : null;
	}else{
		search_content = (param) ? param.trim() : null;
	}

	//check if the search_content is empty or null
	const search = (search_content == null || search_content.length == 0) ? null : async() => {

		//Adds Animation that loads before the search result is ready.
		document.getElementById("bs_search_results_id")
		.innerHTML = `<div class="sk-fading-circle">
						  <div class="sk-circle1 sk-circle"></div>
						  <div class="sk-circle2 sk-circle"></div>
					      <div class="sk-circle3 sk-circle"></div>
						  <div class="sk-circle4 sk-circle"></div>
						  <div class="sk-circle5 sk-circle"></div>
						  <div class="sk-circle6 sk-circle"></div>
						  <div class="sk-circle7 sk-circle"></div>
						  <div class="sk-circle8 sk-circle"></div>
						  <div class="sk-circle9 sk-circle"></div>
						  <div class="sk-circle10 sk-circle"></div>
						  <div class="sk-circle11 sk-circle"></div>
						  <div class="sk-circle12 sk-circle"></div>
					  </div>`;


		//Connect to the API..
		await fetch("https://www.googleapis.com/books/v1/volumes?q=" + search_content+"&maxResults="+maxResults+"&startIndex="+startIndex)
		.then((result) => result.json())
		.then((result) =>{

			console.log("Here is the result: ", result);

			//Add this to the page .. 
			let resultCode = `<table class='table table-hover'> 
								<tr> 
									<th>Results</th>
									<th></th>
								</tr>
								<tbody>
								`;

			for(let i = 0; i < result.items.length; i++){

				//check if an image is available
				let imageAvailability = (result.items[i].volumeInfo.readingModes.image == false) 
										? `<img src='https://via.placeholder.com/150'>` 
										: `<img src='${result.items[i].volumeInfo.imageLinks.smallThumbnail}' alt='book image'>`;

				//check for description availability..
				let description = (result.items[i].volumeInfo.description == null) 
									? "Not available" 
									: result.items[i].volumeInfo.description;

				resultCode +=  `<tr> 

									<td>${imageAvailability}</td>
									<td>
									<h4><a href='${result.items[i].volumeInfo.infoLink}' target='__blank'>${result.items[i].volumeInfo.title}</a></h4>
									<h5>Description</h6>
									<p>${description}</p>
									<hr>
									<h6>Author: ${result.items[i].volumeInfo.authors}</h6>
									</td>

								</tr>`;

			}

			resultCode += `</tbody></table>`;

			//add pagination..
			let paginationCode = null;
			let boxesNumber = 0;
			if(result.totalItems > maxResults){
				//pagination MUST be set ...
				//divide the totalItems by maxResults..
				boxesNumber = Math.ceil(result.totalItems / maxResults);

				console.log("Number of boxes: ", boxesNumber);

				//Show page one..
				
				paginationCode = `<nav aria-label="">
										  <ul class="pagination justify-content-center" id='bs_pagination_id'>
										    <li class="page-item disabled">
										      <a class="page-link" href="#" tabindex="-1" onclick='return previousPage(event)'>Previous</a>
										    </li>
										    <li class="page-item">
										      <a class="page-link" href="#" onclick='return nextPage(event);'>Next</a>
										    </li>
										  </ul>
										</nav>`;

				
			}

			resultCode += paginationCode;

			document.getElementById("bs_search_result_info").innerHTML = `<h4>Page ${pageNumber}</h4><hr>`;
			document.getElementById("bs_search_results_id").innerHTML = resultCode;

			//Put the pagination code at the top of the page too..
			//document.getElementById("search_top_pagination_id").innerHTML = paginationCode;

			//Place the Search content in the form 
			document.getElementsByName('search_contents')[0].value = search_content;

			if(pageNumber > 1 && pageNumber < boxesNumber){
				let list = document.getElementById("bs_pagination_id").children[0];
				let anchorTag = list.children[0];

				list.classList.remove("disabled"); 

				anchorTag.removeAttribute("tabindex");
			}

			if(pageNumber == boxesNumber){

				let list = document.getElementById("bs_pagination_id").children[1];
				let anchorTag = list.children[0];

				list.classList.add("disabled"); 
				anchorTag.setAttribute("tabindex", -1);


			}


			

		})
	};

	//Perform the actual search ..
	if(search){
		search();
	}

	
}


/**
 * Submit the form ..
 * This only works when the user clicks to submit the form
 */
document.querySelector("#bs_search_books_form_id").addEventListener("submit", start);



/**
 * Handles the address bar url ...
 */
const window_contents = new URLSearchParams(window.location.search);

const window_search_contents = window_contents.get('search_contents');

const window_startIndex = (window_contents.has("startIndex")) ? window_contents.get("startIndex") : defaultStartIndex;

const maxResults = (window_contents.has("maxResults")) ? window_contents.get("maxResults") : defaultMaxResults;

const pageNumber = (window_contents.has("pageNumber")) ? window_contents.get("pageNumber") : defaultPageNumber;


//call the start function ..
//this will kickstart the search process
start(event, window_search_contents, pageNumber, window_startIndex, maxResults);


// -- Pagination--

/**
 * Handles Next Result
 */
function nextPage(event){
	event.preventDefault();

	//Get the current page number ..
	//the pageNumber at this point MUST have been set..
	let window_contents = new URLSearchParams(window.location.search);

	let window_search_contents = window_contents.get('search_contents');

	let pageNumber = (window_contents.has("pageNumber")) ? window_contents.get("pageNumber") : defaultPageNumber;

	let nextPageNumber = parseInt(pageNumber) + 1;

	let window_startIndex = parseInt(pageNumber) * defaultMaxResults;

	location.href=`?search_contents=${window_search_contents}&startIndex=${window_startIndex}&pageNumber=${nextPageNumber}`;


}


/**
 * Handles Previous Result
 */
function previousPage(event){
	event.preventDefault();

	//Get the current page number ..
	//the pageNumber at this point MUST have been set..
	let window_contents = new URLSearchParams(window.location.search);

	let window_search_contents = window_contents.get('search_contents');

	let pageNumber = (window_contents.has("pageNumber")) ? window_contents.get("pageNumber") : defaultPageNumber;

	let window_startIndex = window_contents.get("startIndex");

	let previousPageNumber = parseInt(pageNumber) - 1;


	let window_prevStartIndex = parseInt(window_startIndex) - defaultMaxResults

	location.href=`?search_contents=${window_search_contents}&startIndex=${window_prevStartIndex}&pageNumber=${previousPageNumber}`;


}






