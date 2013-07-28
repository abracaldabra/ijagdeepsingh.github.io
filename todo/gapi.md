## Creating a http request

### Method 1
```
gapi.client.request(
{
  path: 'oauth2/v3/userinfo?alt=json',

  callback: jd
});
```
### Method 2
```
gapi.client.calendar.calendarList.list(
  {
    'fields' : 'items(id)'
  }
).execute(jd);
```
#### Another call using method 2
```
gapi.client.calendar.calendarList.get({

calendarId: 'mrmundi11@gmail.com',
fields: 'id'

}).execute(jd);
```

https://www.googleapis.com/oauth2/v3/userinfo?alt=json