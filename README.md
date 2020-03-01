# WunderList 2.0
Back End Repo for WunderList

"Never have to wonder about your day, let WunderList do it for you!"

Base URL:
<https://wunderlistbuildweek.herokuapp.com/>


|Method| URL | Description| Requirements|
|:-----:|:-----|:-----|:-----|
|POST| /api/auth/register| register a new user| name, username, password|
|POST| /api/auth/login| login | username, password|
|POST| /api/lists/| add a new list | token, list object|
|GET| /api/lists/today| get recurring tasks | token, date object|
|GET| /api/lists/mylists| get all lists for a user | token|
|DELETE| /api/lists/:id| delete a list | list id|
|POST| /api/lists/:id/tasks| add task to a list | token, list id, task object|


### sample user object for registration
```javascript
{
    name: 'Bob Bobbington',
    username: 'bob123',
    password: 'mygreatpassword'
}
```

### sample user object for login
```javascript
{
    username: 'bob123',
    password: 'mygreatpassword'
}
```

### sample date object
```javascript
{
    day: 01,
    weekday: 'sun',
    month: 'mar'
}
```

## Adding a List

<https://wunderlistbuildweek.herokuapp.com/api/lists>
this endpoint must also be passed a token on the request

|Property| Required? | Type| 
|:-----|:-----:|:-----|
|name| YES| string| 


## Adding a task
<https://wunderlistbuildweek.herokuapp.com/api/lists/:id/tasks> this endpoint must also be bassed a token on the request

|Property| Required? | Type| Possible Values|
|:-----|:-----:|:-----|:----|
|description| YES| string| 
|frequency| YES| string| none, daily, weekly, monthly, annually|
|day| NO | integer| 
|weekday|NO| string| sun, mon, tue, wed, thu, fri, sat|
|month|NO|string| jan, feb, mar, apr, may, etc|

If the frequency of a task is not "none" or "daily" then it should also have a corresponding value in the day, weekday, or month value. Examples below.


### task object without a frequency
```javascript
{
    description: 'finish my homework',
    frequency: 'none'
}
```

### task object with daily frequency
since this task will recur every day, no additional information needs to be specified
```javascript
{
    description: 'finish my homework',
    frequency: 'daily'
}
```

### task object with weekly frequency
since this task will recur on the same day every week, only the week day needs to be specified
```javascript
{
    description: 'finish my homework',
    frequency: 'weekly',
    weekday: 'mon'
}
```

### task object with monthly frequency
since this task will recur on the same day every month, only the day of the month needs to be specified
```javascript
{
    description: 'finish my homework',
    frequency: 'monthly',
    day: 15
}
```

### task object with annual frequency
since this task will recur on the same day every year, the day of the month and the month name need to be specified
```javascript
{
    description: 'finish my homework',
    frequency: 'annually',
    day: 23,
    month: 'dec'
}
```





