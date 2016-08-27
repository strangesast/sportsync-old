## “Sportsync” models
### Player:
Description: information about a player, not specific to particular game
```
{
  name: (object), {
    first: (string),
    last: (string)
  }
}
```
Examples: “John Doe”

### Team:
Description: Collection of players
```
{
  name: (string),
  players: (array)
}
```
Examples: “East Aurora”

### Game:
Description: game general information, jno specific state info
```
{ 
  name: (string),
  participating_teams: (array),
  start date: (date or number),
  end date: (date or number)
}
```
Examples: “EA vs OP”

### Event:
Description: state information about some subdivision of game, time stored for stopwatch-like storage of current event time.  May have additional timers.
```
{
  name: (string),
  attribute: value (mixed),
  time: (object) {
    start: (date or number - ms precision),
    cumulative: (date or number)
  }
}
```
Examples: quarter, race, or game itself (if no clear event exists)

### Transaction:
Description: describes a change to an event or game (or anything else where version tables are not suitable)
```
{
  old_value: (mixed)
  new_value: (mixed)
  date: (date or number)
  by: (objectid)
}
```
Examples: “3 point scored, game (event) score modified from 6 to 9”, “

### Action

Description: transaction template, generates a transaction after user (or timing system) input
```
{
  event: (objectid),
  $inc: { field1: amount1, field2: amount2, ... },
  $dec: { field1: amount1, field2: amount2, ... }
  $set: { field1: value1, field2: value2, ... }
}
```
Examples: Point scored, race completion
