var React = require('react');
var ReactDOM = require('react-dom');

var ContactFormComponent = React.createClass({
    newContact: {
        name: "James Stevenson",
        email: "info@presence.agency"
    },
    getInitialState: function() {
        return {
            errorMessage: "",
            nameTextBoxClass: "textBox",
            emailTextBoxClass: "textBox"
        }

    },
    validate: function() {
        this.setState({
            errorMessage: "",
            emailTextBoxClass: "textBox",
            nameTextBoxClass: "textBox"
        });

        if (!(this.newContact.name && /^[a-zA-Z][a-z A-Z]*$/.test(this.newContact.name))) {
            this.setState({
                errorMessage: "Please enter valid name",
                nameTextBoxClass: "textBoxInvalid"
            });
            return false;
        }

        if (!(this.newContact.email && /.+@.+\..+/.test(this.newContact.email))) {
            this.setState({
                errorMessage: "Please enter valid email",
                emailTextBoxClass: "textBoxInvalid"
            }); //only setState re renders component..should not do this.state.error="hello"
            return false;
        }
        //TODO: Add validations if more fields are added
        this.setState({
            errorMessage: "",
            emailTextBoxClass: "textBox",
            nameTextBoxClass: "textBox"
        });
        return true;
    },
    onSubmitForm: function() {
        this.newContact.name = this.refs.nameValue.value; //event.target.value could be used with onChange handlers for every input
        this.newContact.email = this.refs.emailValue.value;
        var validation = this.validate();
        if (validation) {
            //Empty the fields and update the contacts
            this.props.onSubmitForm(this.newContact);
            this.newContact.name = this.refs.nameValue.value = "";
            this.newContact.email = this.refs.emailValue.value = "";
        }
    },
    render: function() {
        var errorDivStyle = {
            color: 'red',
            textAlign: 'left',
            display: 'block',
            'marginLeft': '6%'
        }; //inline css
        return ( < div >
            < div className = "mainHeading" > Add to Addressbook < /div> < div className = "form" > < input type = "text"
            ref = "nameValue"
            className = {
                this.state.nameTextBoxClass
            }
            placeholder = "Full Name" / >
            < input type = "text"
            ref = "emailValue"
            className = {
                this.state.emailTextBoxClass
            }
            placeholder = "Email Address" / >
            < div style = {
                errorDivStyle
            } > {
                this.state.errorMessage
            } < /div>  < input type = "button"
            defaultValue = "Add Contact"
            className = "button"
            onClick = {
                this.onSubmitForm
            }
            /> < /div > < /div>
        );
    }
});









var ContactDetails = React.createClass({
    render: function() {
        return ( < div className = "contactDetails" >
                < input type = "button"
                className = "deleteContactButton"
                defaultValue = "x"
                onClick = {
                    this.props.onDeleteClick
                }
                /> < br / >
                < div className = "fieldName" > Name: < /div> < div className = "fieldValue" > {
                this.props.contact.name
            } < /div> < br / >
            < div className = "fieldName" > Email: < /div> < div className = "fieldValue" > {
        this.props.contact.email
    } < /div>

        < /div>
);
}
})









var ContactListComponent = React.createClass({
    newContact: {
        //"id" : null,
        "name": "",
        "email": ""
    },
    getInitialState: function() {
        return {
            contacts: []
        }
    },
    componentDidMount: function() {
        var xmlhttp = new XMLHttpRequest();
        var url = "http://localhost:3000/getJsonData";

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                //ToDO: check when there is no data
                var contactsResponse = xmlhttp.responseText;
                if (this.isMounted()) {
                    if (!contactsResponse) {
                        console.log("Error on server side");
                    } else {
                        contactsResponse = JSON.parse(contactsResponse);
                        this.setState({
                            contacts: contactsResponse.contacts.slice()
                        });
                    }
                }

            }
        }.bind(this);
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    },
    componentWillUnmount: function() {

    },
    shouldComponentUpdate: function() {
        //Called everytime a state or prop passed from parent is changed
        //Problem with putting below code in this block: too many requests to server
        //Each http request made to the node.js server expects a single response, after which the connection is ended.
        return true;
    },
    saveContactList: function() {
        var xmlhttp = new XMLHttpRequest();
        var url = "http://localhost:3000/saveList";
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log(xmlhttp.responseText);
                // myFunction(myArr);
                return true;
            }
        };
        xmlhttp.open("POST", url); //Same for get
        xmlhttp.setRequestHeader("Content-Type", 'application/json');
        xmlhttp.send(JSON.stringify(this.state));
        alert("List has been saved");
        return true;
    },
    onSubmitForm: function(newContact) {
        var addContact = {};
        for (var prop in newContact) {
            if (newContact.hasOwnProperty(prop)) {
                addContact[prop] = newContact[prop];
            }
        }
        this.newContact = {
            "name": "",
            "email": ""
        };
        console.log("You added " + addContact.name);
        this.setState({
            contacts: this.state.contacts.concat(addContact)
        }); //setstate rerenders component
    },
    onDeleteClick: function(index) {
        console.log("You deleted " + this.state.contacts[index].name);
        this.state.contacts.splice(index, 1);
        this.setState({
            contacts: this.state.contacts
        });
    },
    contactDetail: function(contact) {
        var id = this.state.contacts.indexOf(contact);
        return ( < ContactDetails contact = {
                    contact
                }
                key = {
                    id
                }
                onDeleteClick = {
                    this.onDeleteClick.bind(this, id)
                }
                />)
            },
            render: function() {
                var contactDetailComponentNodes = this.state.contacts.map(this.contactDetail);
                return ( < div >
                        < div className = "addContactDiv" >
                        < ContactFormComponent onSubmitForm = {
                            this.onSubmitForm
                        }
                        /> < input type = "button"
                        className = "button"
                        defaultValue = "Save this list"
                        onClick = {
                            this.saveContactList
                        }
                        /> < /div > < div className = "contacts" >
                        < div className = "mainHeading" > YOUR CONTACTS < /div> < div > {
                        contactDetailComponentNodes
                    } < /div> < /div >

                    < /div>
            )

    }
});

ReactDOM.render( < ContactListComponent / > , document.getElementById("contactFormDiv"));
