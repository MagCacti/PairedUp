var Room = function (name, id, owner) {  
  this.roomname = name;
  this.id = id;
  this.owner = owner;
  this.people = [];
  this.status = "available";
};

Room.prototype.addPerson = function(personID) {  
  if (this.status === "available") {
    this.people.push(personID);
  }
};

module.exports = Room;