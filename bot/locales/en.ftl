# /start
start = <b>Hello! Welcome to @EmperorsBot!</b>

        👑 <b>What is Emperors?</b>
        Emperors is a bot to entertain users in your group.
        By typing the name of an emperor, your users can become the emperor of the day.
    
        ❔ <b>How does it work?</b>
        Group administrators will have permission to create an emperor (and remove them) by providing a photo and their identifier (which users will need to type to become the emperor of the day).
    
        ⚡️ <b>How many emperors can be added in a group?</b>
        The answer is simple. Infinite :P
        Feel free to create as many emperors as you like without any limits!

# Command /newking
emperors-add-success = 👑 ➥ Congratulations, Emperor <code>{ $name }</code> is now available to all users!
emperors-add-already-exists = ❗️ Emperor { $name } is already on the throne.
emperors-add-no-name = ❗️ No name, no throne! Please provide a name for the Emperor you want to add.
failed-to-add-emperor = ⚠️ Unable to add Emperor { $name } to the group! The fates have conspired against us. Please try again later.
emperors-add-file-too-big = ❗️ The photo you sent is too big! Please send a photo with a size of less than 2MB.

# Command /removeking
king-remove-does-not-exist = ❌ Emperor { $name } does not exist!
king-remove-removed = ⚔️ Emperor { $name } has been removed!

# Command /listkings (currently unable to modify list style)
list-no-emperors = 🏰 There are no Emperors in this realm!
list-emperors = 👑 <b>Emperors in this realm:</b>

# Action to conquer the king
conquered = ||• <b>Congratulations</b> { $conqueror } •||
            
            ⚔️ You are the new Emperor <code>{ $name }</code> of today! <i>The realm rejoices at the birth of a new conqueror.</i> 🎉🏰
already-conquered = ⚠️ { $name } has already fallen by the hands of { $conqueror }!
already-conquered-by-you = ❗️ You have already claimed victory over { $name }!