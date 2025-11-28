alert("Script file successfully accessed!");

//event listeners
let authorLinks = document.querySelectorAll("a");
for (authorLink of authorLinks) {
    authorLink.addEventListener("click", getAuthorInfo);
}

async function getAuthorInfo() {
    var myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();
    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    // console.log(data);
    let authorInfo = document.querySelector("#authorInfo");
        let dob = data[0].dob ? String(data[0].dob).substring(0, 10) : "N/A";
    let dod = data[0].dod ? String(data[0].dod).substring(0, 10) : "N/A"
    authorInfo.innerHTML = `<h1> ${data[0].firstName}
                                 ${data[0].lastName} </h1>`;
    authorInfo.innerHTML += `<img src="${data[0].portrait}"
    width="200"><br>
    <p><strong>Born:</strong> ${dob}</p>
      <p><strong>Died:</strong> ${dod}</p>
      <p><strong>Sex:</strong> ${data[0].sex}</p>
      <p><strong>Profession:</strong> ${data[0].profession}</p>
      <p><strong>Country:</strong> ${data[0].country}</p>
      <p><strong>Biography:</strong> ${data[0].biography}</p>
    `;
}