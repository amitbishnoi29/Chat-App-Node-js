class Users {
    constructor() {
        this.users = [];
    }
    addUser (id , name , room) {
        let user = {id , name , room};
        this.users.push(user);
        return user;
    }
}

let user = new Users();
user.addUser(1234,"amit",'fun');
user.addUser(2345,'sunnu','fun');
console.log(user.users);
