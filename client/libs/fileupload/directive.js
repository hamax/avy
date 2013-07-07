// Based on https://github.com/clouddueling/angularjs-drag-n-drop, modified for avy-project
app.directive('ngFileUpload', function() {
  // Helper function that formats the file sizes
  function formatFileSize(bytes) {
    if (typeof bytes !== 'number') {
      return '';
    }

    if (bytes >= 1000000000) {
      return (bytes / 1000000000).toFixed(2) + ' GB';
    }

    if (bytes >= 1000000) {
      return (bytes / 1000000).toFixed(2) + ' MB';
    }

    return (bytes / 1000).toFixed(2) + ' KB';
  }

  return {
    restrict: 'A',
    link: function(scope, elem, attr, ctrl) {
      var dragForm = "<form class='file-upload' method='post' enctype='multipart/form-data'> \
        <div class='drop'> \
          Drop Here<br> \
          <a>Browse</a> \
          <input type='file' name='file' multiple /> \
        </div> \
        <ul></ul> \
      </form>";

      elem.html(dragForm);

      var ul = $(elem).find('.file-upload ul');

      elem.find('.drop a').on('click', function(){
        // Simulate a click on the file input button
        // to show the file browser dialog
        $(this).parent().find('input').click();
      });

      // Initialize the jQuery File Upload plugin
      elem.find('.file-upload').fileupload({
        // This element will accept file drag/drop uploading
        dropZone: elem.find('.drop'),

        singleFileUploads: false,

        // This function is called when a file is added to the queue;
        // either via the browse button, or via drag/drop:
        add: function (e, data) {
          data.context = [];
          for (var i = 0; i < data.files.length; i++) {
            var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"'+
              ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');

            // Append the file name and file size
            tpl.find('p').text(data.files[i].name)
              .append('<i>' + formatFileSize(data.files[i].size) + '</i>');

            // Add the HTML to the UL element
            data.context.push(tpl.appendTo(ul));

            // Initialize the knob plugin
            tpl.find('input').knob();

            // Listen for clicks on the cancel icon
            tpl.find('span').click(function() {
              if(tpl.hasClass('working')) {
                jqXHR.abort();
              }

              tpl.fadeOut(function() {
                tpl.remove();
              });
            });
          }

          // Automatically upload the file once it is added to the queue
          var jqXHR = data.submit();
        },

        // Update upload url on submit (upload url-s are not reusable)
        submit: function (e, data) {
          var $this = $(this);
          $.getJSON('/rest/uploadurl?vkey=' + attr.ngFileUpload, function(result) {
            data.url = result;
            $this.fileupload('send', data);
          });
          return false;
        },

        done: function(e, data) {
          scope.$apply(function(s) {
            s.data = data.response().result;
            s.$eval(attr.complete);
          });
        },

        progress: function(e, data){
          // Calculate the completion percentage of the upload
          var progress = parseInt(data.loaded / data.total * 100, 10);

          // Update the hidden input field and trigger a change
          // so that the jQuery knob plugin knows to update the dial
          for (var i = 0; i < data.context.length; i++) {
            data.context[i].find('input').val(progress).change();

            if(progress == 100){
              data.context[i].removeClass('working');
            }
          }
        },

        fail:function(e, data){
          scope.$apply(function(s) {
            s.$eval(attr.error);
          });

          for (var i = 0; i < data.context.length; i++) {
            data.context[i].addClass('error');
          }
        }
      });

      // Prevent the default action when a file is dropped on the window
      $(document).on('dragover', function (e) {
        e.preventDefault();
        elem.find('.drop').addClass('active');
      });

      $(document).on('drop dragleave', function (e) {
        e.preventDefault();
        elem.find('.drop').removeClass('active');
      });
    }
  }
});