import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  //  posts = [
  //    {title: 'first', content: 'First Post'},
  //    {title: 'second', content: 'Second Post'},
  //    {title: 'third', content: 'Third Post'}
  //  ];
  isLoading = false;
   posts: Post[] = [];
   private postSub: Subscription;
   totalPosts = 0;
   postsPerPage = 2;
   currentPage = 1;
   pageSizeOptions = [1, 2, 5, 10];
   userIsAuthenticated = false;
   userId: string;
  private authListenerSubs: Subscription;

   constructor(public postsService: PostService, private authService: AuthService ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPost(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSub = this.postsService.getPostUpdateListner()
    .subscribe((postData: { posts: Post[] , postCount: number}) => {
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });

    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getUserStatusListener()
    .subscribe(isAuthenticate => {
      this.userIsAuthenticated = isAuthenticate;
      this.userId = this.authService.getUserId();
    });

  }
  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPost(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPost(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authListenerSubs.unsubscribe();

  }

}
