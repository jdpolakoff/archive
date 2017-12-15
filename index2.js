
$(document).ready(function(){
  var artists = ["John Lee Hooker", "Lightnin' Hopkins", "Keller Williams", "Yonder Mountain String Band", "Jack Johnson", "Blues Traveler", "My Morning Jacket", "Bill Monroe", "Sonny Osborne", "Jimmie Skinner", "Kurt Vile", "Robert Randolph", "Papa String Band", "Jake Shimabukuro", "Allman Brothers", "Grateful Dead", "Mississippi John Hurt", "KEXP", "Steep Canyon Rangers", "Acoustic Junction", "Jerry Garcia", "Mance Lipscomb", "Sonny Boy Williamson"]
  var options = artists.map(function(artist){
    return `<option value=${artist.split(' ').join('+')}>${artist}</option>`
  })
  $('.dropDown').append(`<option>Choose An Artist</option>`)
  for (z = 0; z < options.length; z++) {
    $('.dropDown').append(options[z])
  }
  // var genres = ["Bluegrass"]
  // var options2 = genres.map(function(genre){
  //   return `<option value=${genre.split(' ').join('+')}>${genre}</option>`
  // })
  // $('.genre').append(`<option>Choose A Genre</option>`)
  // for (e = 0; e < options2.length; e++) {
  //   $('.genre').append(options2[e])
  // }


  $('.dropDown').change(function(){
    $('.nowPlaying').empty()
    getSong()
  })

  $('#next').click(function(){
    $('.nowPlaying').empty()
    getSong()
  })

  $('audio').on('ended', function(){
    $('.nowPlaying').empty()
    getSong()
  })

  function getSong(){
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
            return item.format === '128Kbps MP3' || item.format === '64Kbps MP3' || item.format === 'VBR MP3'
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
        $('.nowPlaying').append(`<h2>Now playing: ${$('.dropDown').val().split('+').join(' ')} radio</h2>`)
        if (selectedSong.artist) {
          $('.nowPlaying').append(`<h2>${selectedSong.artist}</h2>`)
        }
        if (selectedSong.song){
          $('.nowPlaying').append(`<h2>${selectedSong.song}</h2>`)
        }
        if (selectedSong.album){
          $('.nowPlaying').append(`<h2>${selectedSong.album}</h2>`)
        }
        if (!selectedSong.artist && !selectedSong.song && !selectedSong.album){
          $('.nowPlaying').append(`<h2>NO SONG INFO AVAILABLE</h2>`)
        }
      })
    })
  }
})

  // $('.genre').change(function(){
  //   console.log('hi')
  //   var genre = $('.genre').val()
  //   console.log(genre)
  //   var shows
  //   var identifiers
  //   var url = `https://archive.org/advancedsearch.php?q=genre%3A%22${genre}%22&fl%5B%5D=creator&fl%5B%5D=format&fl%5B%5D=genre&fl%5B%5D=identifier&fl%5B%5D=mediatype&fl%5B%5D=name&fl%5B%5D=title&sort%5B%5D=date+asc&sort%5B%5D=&sort%5B%5D=&rows=10000&page=1&output=json&callback=callback&save=yes#raw`
  //   $.ajax({
  //     headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded'
  //       },
  //     url: url,
  //     type: 'get',
  //     dataType: 'jsonp',
  //     jsonpCallback: 'callback'
  //   }).then((response) => {
  //     var mps = response.response.docs.filter(function(item){
  //       return item.mediatype === 'audio'
  //     })
  //     console.log(mps)
  //     var mps = response.response.docs.filter(function(item){
  //       for (j = 0; j < item.format.length; j++){
  //         if (item.format[j] === 'MP3 Sample') {
  //           return
  //         }
  //         else if (item.format[j] === '128Kbps MP3'){
  //           return item
  //         } else if (item.format[j] === '64Kbps MP3'){
  //           return item
  //         } else if (item.format[j] === 'VBR MP3'){
  //           return item
  //         }
  //       }
  //     })
  //     console.log(mps)
  //     var identifiers = mps.map(function(item){
  //       return item.identifier
  //     })
  //     console.log(identifiers)
  //     var selectedId = identifiers[Math.floor(Math.random() * identifiers.length)]
  //     console.log(selectedId)
  //     var url2 = `https://archive.org/metadata/${selectedId}`
  //     $.ajax({
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded'
  //       },
  //       url: url2,
  //       type: 'get',
  //       dataType: 'jsonp',
  //       jsonpCallback: 'callback'
  //     }).then((response) => {
  //       console.log(response)
  //       var songs = response.files.filter(function(item){
  //           return item.format === '128Kbps MP3' || item.format === '64Kbps' || item.format === 'VBR MP3'
  //       })
  //       console.log(songs)
  //       var d1 = response.d1
  //       var dir = response.dir
  //       var shows = response.files
  //       var metadata = songs.map(function(song){
  //         var songInfo = {
  //           artist: song.creator,
  //           album: song.album,
  //           song: song.title,
  //           url: `https://${d1}${dir}/${song.name}`
  //         }
  //         return songInfo
  //       })
  //       console.log(metadata)
  //       var selectedSong = metadata[Math.floor(Math.random() * metadata.length)]
  //       console.log(selectedSong)
  //       $('audio').attr('src', selectedSong.url)
  //     })
  //   })
  // })
