﻿/** @jsx React.DOM*/

var React = require('react');
var Router = require('react-router-component');
var AppConstants = require("../constants/AppConstants");
var LocationForm = require("./LocationForm");
var LoadingIndicator = require("./LoadingIndicator");
var LocationStore = require('../stores/LocationStore');
var LocationActions = require('../actions/LocationActions');

var LocationEditPage = React.createClass({displayName: 'LocationEditPage',
    mixins: [Router.NavigatableMixin],

    getInitialState:function(){
        return {Loading:true,Location:null,ResponseError:null};
    }, 
    componentDidMount:function(){
        LocationStore.addSuccessListner(this.onSuccess);
        LocationStore.addFailureListner(this.onFailure);   
    },
    componentWillMount:function(){
        var id = this.props.locationId;
        LocationActions.locationById(id);
    },
    componentWillUnmount:function(){
        LocationStore.removeSuccessListner(this.onSuccess);
        LocationStore.removeFailureListner(this.onFailure);
    },
    submitForm:function(location){
        location.Id = this.state.Location.Id;
        location.CreatedOn = this.state.Location.CreatedOn;
        LocationActions.updateLocation(location);
        return false;
    },
    onSuccess:function(){
        var state = LocationStore.getLocationState();
        if (state.Status === AppConstants.RETRIEVED) {
            this.setState({Location: state.Location, Loading: false});
        }
        else {
            this.navigate("/Locations");
        }
    
    },
    onFailure:function(){
        var error = LocationStore.getErrorState();
        this.setState({ResponseError: error, Loading: false});
    },
    render: function () {

        if (this.state.Loading) {
            return LoadingIndicator(null );
        }

        if (this.state.ResponseError) {
            var errorMessage = React.DOM.div( {className:"error-message"}, this.state.ResponseError.Message);
        }       

        return(
            React.DOM.div(null, 
            React.DOM.h5( {className:"ui header"}, "Edit Location"),
            React.DOM.div( {className:"ui divider"}),
        errorMessage,
        LocationForm( {handleSubmit:this.submitForm, location:this.state.Location} )
        )
            );
    }
});


module.exports = LocationEditPage;