//////////////////////////////////////////////////////////////////////////////
var person = {
	
	name: "Generic Person"
	
	,invite: function(invitation){
		this._appointments[invitation.time] = invitation
	}
	
}
AOP.beforeFirst(person, 'invite', function makeSureIHaveAnAppointmentBook(){
	if (!this._appointments) this._appointments = {}
})
AOP.ensureBefore(person, 'invite').has('_appointments', Object)
AOP(person, 'invite', silentlyRejectFakeInvitations)


//////////////////////////////////////////////////////////////////////////////
var busyPerson = Object.create(person)
AOP(busyPerson, 'invite', acceptOnlyIfImNotBusy)


//////////////////////////////////////////////////////////////////////////////
var bob = Object.create(busyPerson)
bob.name = "Robert"
AOP(bob, 'invite', refuseInvitationsFromJim)
AOP(bob, 'invite', silentlyRefuseInvitationsFromAmy)


//////////////////////////////////////////////////////////////////////////////
var politePerson = Object.create(inconsideratePerson)
AOP(politePerson, 'invite', suggestAnotherTimeIfBusy)


//////////////////////////////////////////////////////////////////////////////

function silentlyRejectFakeInvitations(invitationMaybe){
	if (invitationMaybe != null && typeof invitationMaybe.from == 'object')
		return invitationMaybe
	else
		return AOP.ignore
}


function acceptOnlyIfImNotBusy(invitation){
	var appointment = this._appointments[invitation.time]
	if (!appointment || appointment == invitation)
		return invitation
	else
		throw new Error("Aww man, I'm already booked up at " + invitation.time)
}


function suggestAnotherTimeIfBusy(invitation){
	var appointment = this._appointments[invitation.time]
	if (appointment && appointment != invitation){
		var originalTime = invitation.time
		invitation.time += 15 *60 *1000
		if (!invitation.from.invite(invitation))
			throw new Error("Aww man, I'm already booked up at " + originalTime)
	}
	return invitation
}


function refuseInvitationsFromJim(invitation){
	if (invitation.from.name == 'James')
		throw new Error(this._excuseMessage || "No, thanks")
	return invitation
}


function silentlyRefuseInvitationsFromAmy(invitation){
	if (invitation.from.name == 'Amy') return null
	return invitation
}



