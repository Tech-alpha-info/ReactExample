





// Display a json date in UK format...
function JSONDateToDisplayDate(date) {

    var dateString = date.substr(6);
    var currentTime = new Date(parseInt(dateString));
    
    var month = currentTime.getMonth();
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();

    
    month = month + 1;
    month = (month > 9 ? '' : '0') + month;
    day = (day > 9 ? '' : '0') + day;


    var date = day + "/" + month + "/" + year;
   

    return date;
}







var Comment = React.createClass({

    // Get first initial and put into an icon circle...
    initial: function() {

        var initial = "http://placehold.it/50/55C1E7/fff&text=" + this.props.author.charAt(0);
        console.debug(initial);
        return initial;
    },
    


	 rawMarkup: function() {

		var rawMarkup = this.props.children.toString();
		return { __html: rawMarkup };
	  },


	render: function() {
	    return (

            <li className="left clearfix">
                        <span className="chat-img pull-left">
                           
                            <span className="well" >{this.props.id}</span> 
                            <img src={this.initial()} alt="User Avatar" className="img-circle avatar" />
                        </span>
                        <div className="chat-body clearfix">
                            <div className="header">
                                <strong className="primary-font">{this.props.author}</strong> 
                                    <small className="pull-right text-muted">
                                        <span className="glyphicon glyphicon-time"></span>
                                        {JSONDateToDisplayDate(this.props.commentDate)}
                                    </small>
                            </div>
                            <p className="main-text">
                              
                                <span dangerouslySetInnerHTML={this.rawMarkup()} />
                            </p>
                        </div>
            </li>

		);
	  }
});







var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment author={comment.Author} key={comment.Id} commentDate={comment.CommentDate} id={comment.Id} >
                      {comment.Text}
                </Comment>
      );
    });

    return (
      <div className="commentList">
          <ul className="chat">
              {commentNodes}
          </ul>
      </div>
    );
  }
});





var CommentForm = React.createClass({
    getInitialState: function() {
        return {author: '', text: '', key:0 };
  },

  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },

  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({Author: author, Text: text});
    this.setState({author: '', text: ''});
  },


  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Enter a name..."
          value={this.state.author}
          onChange={this.handleAuthorChange}
          className="input-md"
        />
        <br />
        <textarea className="form-control" rows="3" onChange={this.handleTextChange}  placeholder="Enter some text..." value={this.state.text}></textarea>
        <br />
        <input type="submit" value="Send" className="btn btn-warning btn-lg btn-block" />
      
      </form>
    );
  }
});

  


var CommentBox = React.createClass({
	
	loadCommentsFromServer: function() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', this.props.url, true);
    xhr.onload = function() {
      var data = JSON.parse(xhr.responseText);
      this.setState({ data: data });
    }.bind(this);
    xhr.send();
	  },


  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});

    var data = new FormData();
    data.append('Author', comment.Author);
    data.append('Text', comment.Text);
    //data.append('Id', comments.length + 1);

    var xhr = new XMLHttpRequest();
    xhr.open('post', this.props.submitUrl, true);
    xhr.onload = function() {
      this.loadCommentsFromServer();
    }.bind(this);
    xhr.send(data);
  },



  getInitialState: function() {
    return { data: this.props.initialData };
  },

  componentDidMount: function() {
    window.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },


  render: function() {
    return (
        <div className="commentBox">
                  <div className="panel panel-primary">
                        <div className="panel-heading">
                        <span className="glyphicon glyphicon-comment"></span> Comments
                           
                    </div>
                        <div className="panel-footer clearfix">

                            <CommentForm onCommentSubmit={this.handleCommentSubmit} />

                        </div>
                        <div className="panel-body body-panel">

                            <CommentList data={this.state.data} />

                        </div>
                    </div>
            </div>
                  
    );
  }
});




