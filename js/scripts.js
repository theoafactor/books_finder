/**
 * Universal Function that handles the submission of data 
 * @param  {[type]} event [description]
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
const start = function(event, param = null){

	let search_content = null;
	if(event){
		// /event.preventDefault();//Not preventing the default behaviour
		search_content = (event.type == 'submit') ? this.search_contents.value.trim() : null;
	}else{
		search_content = (param) ? param.trim() : null;
	}

	const search = (search_content == null || search_content.length == 0) ? null : async() => {
		//Connect to the API..
		await fetch("https://www.googleapis.com/books/v1/volumes?q=" + search_content)
		.then((result) => result.json())
		.then((result) =>{

			//Add this to the page .. 
			let resultCode = `<table class='table table-hover'> 
								<tr> 
									<th></th>
									<th>Title</th>
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

			document.getElementById("search_results_id").innerHTML = resultCode;

			//Place the Search content in the form 
			document.getElementsByName('search_contents')[0].value = search_content;
			

		})
	};

	//Perform the actual search ..
	if(search){
		search();
	}
	


}



/**
 * Submit the form ..
 */
document.querySelector("#search_books_form_id").addEventListener("submit", start);



/**
 * Handles the address bar url ...
 */
let window_contents = new URLSearchParams(window.location.search);
window_contents = window_contents.get('search_contents');

//call the start function ..
start(event, window_contents);




