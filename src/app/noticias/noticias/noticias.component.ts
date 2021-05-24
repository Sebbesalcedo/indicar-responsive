import { Component, OnInit } from '@angular/core';
import { WebApiService } from 'src/app/servicios/web-api.service';
import { AppComponent } from 'src/app/app.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit {
  // LOADING
  public loading:boolean = false;
  // VARIABLES
  post_primary:any          = [];
  post_secundary:any        = [];
  other_posts:any           = [];
  viewPostPrimary:boolean   = false;
  viewPostSecundary:boolean   = false;
  news:boolean              = false;

  p_filtros:any                = [];
  
  // paginador
  pages:number              = 0;
  paginator:any             = {};
  qtyPages:number           = 5;
  total_posts;
  page:number               = null; // pagina actual.
  
  constructor(
    private WebApiService:WebApiService,
    private route:ActivatedRoute,
    private router:Router
  ){}

  ngOnInit() {
    this.loading = true;
    this.getHeaders();
    this.route.queryParams.subscribe(params=>{
      this.page               = (params['page'] != null )? parseInt(params['page']) : 1;
      this.p_filtros['page']  = this.page;
      this.sendRequest();
    })
  }


  getHeaders(){
    let params = {
      per_page: AppComponent.news_per_page
    }
    this.fetchGet(AppComponent.urlNews,params)
    .then(response=>{
      this.total_posts  = parseInt(response.headers.get('X-WP-Total'));
      this.pages        = parseInt(response.headers.get('X-WP-TotalPages'));
    })
    .catch(error=>{
      console.log(error);
    })
  }
  fetchGet(url,params){
    let route = new URLSearchParams();
    Object.keys(params).forEach( key => route.append(key, params[key]));
    return fetch(url + '?' + route.toString());
  }
  sendRequest(){
    this.WebApiService.getRequest(AppComponent.urlNews,
      Object.assign({
      _embed: true,
      per_page: AppComponent.news_per_page
    },this.p_filtros))
    .subscribe(
      data=>{
        // console.log(data);
        if(Array.isArray(data)){
          if(this.page == 1){ // primera pagina muestro diferente
            //POST PRIMARIO
            if(data.length > 0){
              this.post_primary   = data[0];
              this.viewPostPrimary = true;
            }
            // POST SECUNDARIOS
            if(data.length > 1){
              for(let i=1; i <= 3;i++){
                this.post_secundary.push(data[i]);
              }
              this.viewPostSecundary = true;
            }
            // OTROS POSTS
            if(data.length > 3){
              data.forEach((item,index)=>{
                if(index>3){
                  this.other_posts.push(item);
                }
              });
            }
          }else{ // otras paginas cambia la apariencia
            this.other_posts = [];
            this.viewPostPrimary = false;
            this.viewPostSecundary = false;
            data.forEach((item,index)=>{
              this.other_posts.push(item);
            });
          }
        }
        this.news = true;
        this.loading = false;
        // console.log(this.post_primary['_embedded']['wp:featuredmedia'][0].source_url);
        this.calculatePages();
      },
      error=>{
        this.loading = false;
        console.log(error);
      }
    );
  }

  calculatePages(){
    let arrayPages  = Array();
    if(this.page >= this.qtyPages){ // mayor al numero de paginas iniciales.
      let sideLength  = Math.ceil(this.qtyPages/2);// paginas a los laterales de la pagina actual.
      let minSide     = (this.page-sideLength <= 0)? 1:this.page-sideLength;
      let maxSide     = (this.page+sideLength>=this.pages)? this.pages : this.page+sideLength;
      for(minSide;minSide<=maxSide;minSide++){
        if(minSide> 0 && maxSide <= this.pages){
          arrayPages.push(minSide);
        }
      }
    }else{
      // bucle hasta cantidad de paginas a mostrar
      for(let i = 1; i <= this.qtyPages; i++){
        if(i <= this.pages){
          arrayPages.push(i);
        }
      }
    }
    this.paginator = {
      currentPage: this.page,
      pages:arrayPages,
      totalPages: this.pages
    }
  }


  reload(filtros=null){
    if(filtros != null){
      this.p_filtros = filtros;
    }
    this.router.navigate(['noticias'], { queryParams: this.p_filtros });
    this.sendRequest();
  }

  setPage(page:number){
    if(this.page != page && page > 0 && page <= this.pages){
      this.loading = true;
      this.page = page;
      this.p_filtros['page'] = page;
      this.reload();
    }
    
  }

}
