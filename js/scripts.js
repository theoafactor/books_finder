/**
 * Submit the form ..
 */
document.querySelector("#search_books_form_id").addEventListener("submit", function(event){

	event.preventDefault();

	//Get the input values ..
	const search_content = this.search_contents.value.trim();

	const search = (search_content.length == 0) ? null : async() => {
		//Connect to the API..
		await fetch("https://www.googleapis.com/books/v1/volumes?q=" + search_content)
		.then((result) => result.json())
		.then((result) =>{

			console.log("Here is the result: ", result);

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


				resultCode +=  `<tr> 

									<td>${imageAvailability}</td>
									<td>
									<h4><a href='${result.items[i].volumeInfo.infoLink}' target='__blank'>${result.items[i].volumeInfo.title}</a></h4>
									<hr>
									<h5>Author: ${result.items[i].volumeInfo.authors}</h5>
									</td>

								</tr>`;


			}

			resultCode += `</tbody></table>`;

			document.getElementById("search_results_id").innerHTML = resultCode;
			

		})
	};

	//Perform the actual search ..
	if(search){
		search();
	}

})

