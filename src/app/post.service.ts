import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPost(postsPerPage: number, currentPage: number) {
    const pageParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.httpClient
    .get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + pageParams)
    .pipe(map((postData) => {
      return { posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }), maxPosts: postData.maxPosts};
    }))
    .subscribe((newPostData) => {
      this.posts = newPostData.posts;
      this.postUpdated.next({posts: [...this.posts], postCount: newPostData.maxPosts});
    });
  }

  getOnePost(id: string) {
    return this.httpClient.get<
    { id: string, title: string, content: string, imagePath: string, creator: string }
    >('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdateListner() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.httpClient.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
    .subscribe((responseData) => {
      // tslint:disable-next-line: object-literal-shorthand
    /*  const post: Post = {id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath};
      this.posts.push(post);
      this.postUpdated.next([...this.posts]); */
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
        // tslint:disable-next-line: object-literal-shorthand
        postData = {id: id, title: title, content: content, imagePath: image, creator: null};
    }
    this.httpClient.put('http://localhost:3000/api/posts/' + id, postData)
    .subscribe(response => {
    /*  const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      // tslint:disable-next-line: object-literal-shorthand
      const post: Post = {id: id, title: title, content: content, imagePath: " "};
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postUpdated.next(...[this.posts]);
    */
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.httpClient.delete('http://localhost:3000/api/posts/' + postId);
  }
}
