import { Component, OnInit } from '@angular/core';
import { WebApiService } from 'src/app/servicios/web-api.service';
import { AppComponent } from 'src/app/app.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-noticias-detalle',
  templateUrl: './noticias-detalle.component.html',
  styleUrls: ['./noticias-detalle.component.css']
})
export class NoticiasDetalleComponent implements OnInit {

  post:any        = null;
  title:string    = null;
  content:string  = null;
  image:string    = null;
  constructor(
    private route:ActivatedRoute,
    private WebApiService:WebApiService
  ){}

  ngOnInit(){
    this.sendRequest(this.route.snapshot.paramMap.get('id'));
  }

  sendRequest(id){
    let link = AppComponent.urlNews+'/'+id;
    this.WebApiService.getRequest(link,{
      '_embed': true
    })
    .subscribe(
      data=>{
        this.title    = data.title.rendered;
        // this.content  = this.utf8_decode(this.utf8_encode(data.content.rendered));
        this.content  = data.content.rendered;
        this.image    = data._embedded['wp:featuredmedia'][0].source_url;
        this.post = data;
        console.log(this.post);
      },
      error=>{
        console.log(error);
      }
    )
  }
  utf8_decode (strData) { // eslint-disable-line camelcase
    //  discuss at: https://locutus.io/php/utf8_decode/
    // original by: Webtoolkit.info (https://www.webtoolkit.info/)
    //    input by: Aman Gupta
    //    input by: Brett Zamir (https://brett-zamir.me)
    // improved by: Kevin van Zonneveld (https://kvz.io)
    // improved by: Norman "zEh" Fuchs
    // bugfixed by: hitwork
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // bugfixed by: Kevin van Zonneveld (https://kvz.io)
    // bugfixed by: kirilloid
    // bugfixed by: w35l3y (https://www.wesley.eti.br)
    //   example 1: utf8_decode('Kevin van Zonneveld')
    //   returns 1: 'Kevin van Zonneveld'
  
    var tmpArr = []
    var i = 0
    var c1 = 0
    var seqlen = 0
  
    strData += ''
  
    while (i < strData.length) {
      c1 = strData.charCodeAt(i) & 0xFF
      seqlen = 0
  
      // https://en.wikipedia.org/wiki/UTF-8#Codepage_layout
      if (c1 <= 0xBF) {
        c1 = (c1 & 0x7F)
        seqlen = 1
      } else if (c1 <= 0xDF) {
        c1 = (c1 & 0x1F)
        seqlen = 2
      } else if (c1 <= 0xEF) {
        c1 = (c1 & 0x0F)
        seqlen = 3
      } else {
        c1 = (c1 & 0x07)
        seqlen = 4
      }
  
      for (var ai = 1; ai < seqlen; ++ai) {
        c1 = ((c1 << 0x06) | (strData.charCodeAt(ai + i) & 0x3F))
      }
  
      if (seqlen === 4) {
        c1 -= 0x10000
        tmpArr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)))
        tmpArr.push(String.fromCharCode(0xDC00 | (c1 & 0x3FF)))
      } else {
        tmpArr.push(String.fromCharCode(c1))
      }
  
      i += seqlen
    }
  
    return tmpArr.join('')
  }

  utf8_encode (argString) { // eslint-disable-line camelcase
    //  discuss at: https://locutus.io/php/utf8_encode/
    // original by: Webtoolkit.info (https://www.webtoolkit.info/)
    // improved by: Kevin van Zonneveld (https://kvz.io)
    // improved by: sowberry
    // improved by: Jack
    // improved by: Yves Sucaet
    // improved by: kirilloid
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // bugfixed by: Ulrich
    // bugfixed by: Rafał Kukawski (https://blog.kukawski.pl)
    // bugfixed by: kirilloid
    //   example 1: utf8_encode('Kevin van Zonneveld')
    //   returns 1: 'Kevin van Zonneveld'
  
    if (argString === null || typeof argString === 'undefined') {
      return ''
    }
  
    // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var string = (argString + '')
    var utftext = ''
    var start
    var end
    var stringl = 0
  
    start = end = 0
    stringl = string.length
    for (var n = 0; n < stringl; n++) {
      var c1 = string.charCodeAt(n)
      var enc = null
  
      if (c1 < 128) {
        end++
      } else if (c1 > 127 && c1 < 2048) {
        enc = String.fromCharCode(
          (c1 >> 6) | 192, (c1 & 63) | 128
        )
      } else if ((c1 & 0xF800) !== 0xD800) {
        enc = String.fromCharCode(
          (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
        )
      } else {
        // surrogate pairs
        if ((c1 & 0xFC00) !== 0xD800) {
          throw new RangeError('Unmatched trail surrogate at ' + n)
        }
        var c2 = string.charCodeAt(++n)
        if ((c2 & 0xFC00) !== 0xDC00) {
          throw new RangeError('Unmatched lead surrogate at ' + (n - 1))
        }
        c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000
        enc = String.fromCharCode(
          (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
        )
      }
      if (enc !== null) {
        if (end > start) {
          utftext += string.slice(start, end)
        }
        utftext += enc
        start = end = n + 1
      }
    }
  
    if (end > start) {
      utftext += string.slice(start, stringl)
    }
  
    return utftext
  }

}
// _embedded:
// author: [{…}]
// replies: [Array(1)]
// wp:featuredmedia: Array(1)
// 0:
// id: 32
// date: "2019-11-12T16:53:21"
// slug: "concesionario-renault"
// type: "attachment"
// link: "https://api.weezzy.com.co/indicar/2019/11/05/renault/concesionario-renault/"
// title: {rendered: "concesionario-renault"}
// author: 1
// caption: {rendered: ""}
// alt_text: ""
// media_type: "image"
// mime_type: "image/jpeg"
// media_details: {width: 600, height: 338, file: "2019/11/concesionario-renault.jpg", sizes: {…}, image_meta: {…}}
// source_url: