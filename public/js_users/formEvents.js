export const declareFormEvents = (_doApi) => {
    let id_form = document.querySelector("#id_form");

    id_form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        let dataBody = {
            name: document.querySelector("#id_name").value,
            email: document.querySelector("#id_email").value,
            password: document.querySelector("#id_password").value,
        };

        console.log(dataBody);
        addUser(dataBody, _doApi);
    })
}

const addUser = async (_obj, _doApi) => {
    let url = "http://localhost:3000/users";
    try {
        let resp = await axios({
            url,
            method: "POST",
            data:JSON.stringify(_obj),
            headers : {
                "content-type":"application/json"
            }
        });

        if(resp.data._id) {
            alert("user added");
            _doApi();
        } else {
            alert("There problem, come back later!");
        }

    } catch(err) {
        console.log(err);
        alert(err.response.data[0]?.message || err.response.data?.msg);
    }
}