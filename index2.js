

$(document).ready(function(){
  var artists = ["Gary Clark Jr", "John Fahey", "John Lee Hooker", "Lightnin' Hopkins", "Muddy Waters"]
  var options = artists.map(function(artist){
    return `<option value=${artist.split(' ').join('+')}>${artist}</option>`
  })
  $('.dropDown').append(`<option>Choose An Artist</option>`)
  for (z = 0; z < options.length; z++) {
    $('.dropDown').append(options[z])
  }


  $('.dropDown').change(function(){
    var artist = $('.dropDown').val()
    var shows
    var identifiers
    var url = `https://archive.org/advancedsearch.php?q=creator%3A%22Muddy+Waters%22&fl%5B%5D=format&fl%5B%5D=identifier&fl%5B%5D=title&sort%5B%5D=&sort%5B%5D=&sort%5B%5D=&rows=200&page=1&output=json&callback=callback&save=yes#raw`
    $.ajax({
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      url: url,
      type: 'get',
      dataType: 'jsonp',
      jsonpCallback: 'callback'
    }).then((response) => {
    // }).then((response) => {
      var mps = response.response.docs.filter(function(item){
        for (j = 0; j < item.format.length; j++){
          if (item.format[j] === 'VBR MP3'){
            return item
          }
        }
      })
      console.log(mps)
      var identifiers = mps.map(function(item){
        return item.identifier
      })
      console.log(identifiers)
      var selectedId = identifiers[Math.floor(Math.random() * identifiers.length)]
      var finalShows = []
      var filteredAlbums
      console.log(selectedId)

        var url2 = `https://archive.org/metadata/${selectedId}`
        $.ajax({
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
          url: url2,
          type: 'get',
          dataType: 'jsonp'
        }).then((response) => {
          console.log(response)

          var songs = response.files


          var d1 = response.d1
          var dir = response.dir
          var shows = response.files.filter(function(item){
            if (item.format === 'VBR MP3' && item.creator) {
              return item.creator.includes(artist.split('+')[0])
            } else if (item.format === 'VBR MP3' && item.artist){
              return item.artist.includes(artist.split('+')[0])
            }
          })
      console.log('hi')
      console.log(shows)
      var albums = shows.map(function(song){
        var songInfo = {
          artist: song.creator,
          album: song.album,
          song: song.title,
          url: `https://${d1}${dir}/${song.name}`
        }
        return songInfo
      })
      console.log(albums)
      var filteredAlbums = []
      var finalAlbums = []
      for (b = 0; b < albums.length; b++) {
        if (albums[b].album) {
          if (albums[b].album.includes('Sampler') === false && albums[b].album.includes('sample') === false && albums[b].album.includes('Blue Yule') === false && albums[b].album.includes('Taste Of Tradition') === false) {
            filteredAlbums.push(albums[b])
            }
          }
        }
      var filtered2 = filteredAlbums.filter(function(album){
        if (album.length > 0){
          return album
        }
      })

      console.log(filtered2)

        })
    })

  })


})
