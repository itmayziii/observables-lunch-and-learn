import { posts } from './posts';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ISubscription } from 'rxjs/Subscription';
import { filter, map, takeLast } from 'rxjs/operators';

export function dataManipulation() {
    const asyncPosts$: Observable<any> = Observable.create((observer: Observer<any>) => {
        let currentIndex = 0;

        let intervalHandler = setInterval(() => {
            if (currentIndex === posts.data.length) {
                clearInterval(intervalHandler);
                observer.complete();
                return;
            }

            observer.next(posts.data[currentIndex]);
            currentIndex++;
        }, 300);
    });

    const onlyOddIdFilter = filter((post: any) => post.id % 2 === 1);
    const capitalizeTitle = map((post: any) => {
        post.attributes.title = post.attributes.title.toUpperCase();
        return post;
    });
    const asyncPostsSubscription: ISubscription = asyncPosts$
        .pipe(
            onlyOddIdFilter,
            capitalizeTitle,
            takeLast(3)
        )
        .subscribe(
            (post: any) => {
                console.log('post ', post);
            },
            () => {},
            () => {
                asyncPostsSubscription.unsubscribe();
            }
        );
}