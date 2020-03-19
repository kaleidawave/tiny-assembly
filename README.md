# A emulator for a Tiny-Assembly

Current available instructions

| Instruction                      |                                                              |
| -------------------------------- | ------------------------------------------------------------ |
| `if (* == 0) goto %line number%` | if the value in the given register is equal to zero then begin execution at the given line |
| `*--`                            | decrement the value in the given register                    |
| `*++`                            | increment the value in the given register                    |
| `goto %line number%`             | begin execution at the given line                            |
| `stop`                           | stop execution                                               |
| `label %label name%`             | prints `%label name%` and stops execution                    |

Where `*` is a single character which refers to a register. All registers are initialised to a random number between 0 and 50

### Examples:

Initialise `x` and set its value to 0

```
if (x == 0) goto 4
x--
goto 1
stop
```

