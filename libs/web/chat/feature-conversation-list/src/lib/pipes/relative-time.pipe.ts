import { Pipe, PipeTransform } from '@angular/core';

// wczesniej masz komponenty na tym samym poziomie nazwane conversation-add, conversation-list itd
// tutaj jest wyjatek - jest dodatkowy katalog z jednym plikiem, nie ma to sensu
// wynioslbym pipes na ten sam poziom co lib
@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date | string | undefined): string {
    if (!value) return '';

    const now = new Date();
    const date = new Date(value);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} d ago`;
    return `${Math.floor(seconds / 2592000)} mo ago`;
  }
}
