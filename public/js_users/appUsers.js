import User from "./userClass.js";
import { declareFormEvents } from "./formEvents.js";

const init = () => {
    doApi();
    declareFormEvents(doApi);
}

const doApi = async () => {
    let url = "http://localhost:3000/users";

    try {
        let resp = await axios.get(url);
        console.log(resp.data);
        createUsersList(resp.data);
    } catch (err) {
        console.log(err);
        alert("There problem, come back later");
    }

}

const createUsersList = _ar => {
    document.querySelector("#tbody").innerHTML = "";
    _ar.forEach((item, index) => {
        let user = new User("#tbody", item, index + 1, doApi);
        user.render();
    });
}

init();