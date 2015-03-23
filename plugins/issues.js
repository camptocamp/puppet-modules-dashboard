dashboard.issues = function(name) {
  r = repositories[name];

  if (r.github.user !== account) {
    // Only relevant if it's our own module
    updateCell(name, 'issues', 'N/A');
    return;
  }

  github.getIssues(r.github.user, r.github.repo).list(null, function(err, issues) {
    var status;
    var text;
    var title;
    var customkey = 0;
    if (err) {
      title = JSON.parse(err.request.response).message;
      if (err.error == 410) {
        text = 'N/A';
        status = 'ok';
      } else {
        text = 'ERR';
        status = 'warn';
      }
    } else {
      var l = 0;
      for (var i=0; i < issues.length; i++) {
        if (! issues[i].pull_request) {
          console.log(i+' is not a pull request');
          l++;
        }
      }
      text = l;
      title = l+' open issues';
      customkey = l;
      if (l > 0) {
        status = 'warn';
      } else {
        status = 'ok';
      }
    }
    html = '<a href="'+r.github.repo_obj.info.html_url+'/issues" title="'+title+'">'+text+'</a>';
    updateCell(name, 'issues', html, status, customkey);
  });
}

