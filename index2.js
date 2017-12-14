
$(document).ready(function(){
  var artists = ["John Lee Hooker", "Lightnin' Hopkins", "Mississippi John Hurt", "Charlie Patton", "Elizabeth Cotten", "Jerry Garcia", "Mance Lipscomb", "Sonny Boy Williamson"]
  var options = artists.map(function(artist){
    return `<option value=${artist.split(' ').join('+')}>${artist}</option>`
  })
  $('.dropDown').append(`<option>Choose An Artist</option>`)
  for (z = 0; z < options.length; z++) {
    $('.dropDown').append(options[z])
  }

  $('.dropDown').change(function(){
    console.log('hi')
    var artist = $('.dropDown').val()
    console.log(artist)
    var shows
    var identifiers
    var url = `https://archive.org/advancedsearch.php?q=creator%3A%22${artist}%22&fl%5B%5D=creator&fl%5B%5D=format&fl%5B%5D=genre&fl%5B%5D=identifier&fl%5B%5D=mediatype&fl%5B%5D=name&fl%5B%5D=title&sort%5B%5D=date+asc&sort%5B%5D=&sort%5B%5D=&rows=50000&page=1&output=json&callback=callback&save=yes#raw`
    $.ajax({
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      url: url,
      type: 'get',
      dataType: 'jsonp',
      jsonpCallback: 'callback'
    }).then((response) => {
      var mps = response.response.docs.filter(function(item){
        return item.mediatype === 'audio'
      })
      console.log(mps)
      var mps = response.response.docs.filter(function(item){
        for (j = 0; j < item.format.length; j++){
          if (item.format[j] === 'MP3 Sample') {
            return
          }
          else if (item.format[j] === '128Kbps MP3'){
            return item
          } else if (item.format[j] === '64Kbps MP3'){
            return item
          } else if (item.format[j] === 'VBR MP3'){
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
      console.log(selectedId)
      var url2 = `https://archive.org/metadata/${selectedId}`
      $.ajax({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: url2,
        type: 'get',
        dataType: 'jsonp',
        jsonpCallback: 'callback'
      }).then((response) => {
        console.log(response)
        var songs = response.files.filter(function(item){
            return item.format === '128Kbps MP3' || item.format === '64Kbps' || item.format === 'VBR MP3'
        })
        console.log(songs)
        var d1 = response.d1
        var dir = response.dir
        var shows = response.files
        var metadata = songs.map(function(song){
          var songInfo = {
            artist: song.creator,
            album: song.album,
            song: song.title,
            url: `https://${d1}${dir}/${song.name}`
          }
          return songInfo
        })
        console.log(metadata)
        var selectedSong = metadata[Math.floor(Math.random() * metadata.length)]
        console.log(selectedSong)
        $('audio').attr('src', selectedSong.url)
      })
    })
  })


  





})
