export default class User {
    constructor(_parent, _item, _index, _doApi) {
        this.parent = _parent;
        this.id = _item._id;
        this.name = _item.name;
        this.email = _item.email;
        this.dateCreated = new Date(_item.date_created).toLocaleDateString();
        this.index = _index;
        this.doApi = _doApi;
    }

    render() {
        let tr = document.createElement("tr");
        document.querySelector(this.parent).append(tr);

        tr.innerHTML = `  
                    <th scope="row">${this.index}</th>
                    <td>${this.name}</td>
                    <td>${this.email}</td>
                    <td>${this.dateCreated}</td>
                    <td><button class="badge bg-danger del-btn">del</button></td>
                    </button></td>
                    `;

        tr.querySelector(".del-btn").addEventListener("click", () => {
            confirm("Are you sure you want to delete?")
                && this.deleteUser(this.id);
        })

    }

    async deleteUser() {
        let url = "http://localhost:3000/users/" + this.id;
        try {
            let resp = await axios({
                url,
                method: "DELETE",
                headers: {
                    "content-type": "application/json"
                }
            })

            if (resp.data.deletedCount == 1) {
                this.doApi();
            } else {
                alert("There problem");
            }
        } catch (err) {
            console.log(err);
            alert("There problem, come back later");
        }
    }
}