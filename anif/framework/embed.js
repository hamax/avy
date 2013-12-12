if (!window.avy_embed_library_included) {
	(function() {
		var embeds = document.getElementsByClassName('avy-visualization');

		window.addEventListener('message', function(event) {
			if (event.origin == 'http://anif.algoviz.net' && event.data.type == 'resize') {
				var embed = embeds[event.data.ref];
				if (embed) {
					var iframe = embed.firstElementChild;
					if (iframe) {
						iframe.setAttribute('style', 'width: 100%; height: ' + event.data.height + 'px;');
					}
				}
			}
		}, false);

		for (var i = 0; i < embeds.length; i++) {
			embeds[i].innerHTML = '<iframe src="' + embeds[i].getAttribute('data-href') + '&amp;' + window.location.origin + '&amp;' + i + '" frameborder="0" style="width: 100%; display: none;"></iframe>';
		}
	})();
}
window.avy_embed_library_included = true;