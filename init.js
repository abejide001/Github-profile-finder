class Github {
    constructor() {
        this.client_id = 'f852c01618a50f96ce6a'
        this.client_secret = '607470f113416c663c041119c7727a1266dd5ce0'
        this.repo_count = 5;
        this.repos_sort = 'created: asc';
    }
    async getUser(user) {
        const profileRes = await fetch(`https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`),
                profileRepo = await fetch(`https://api.github.com/users/${user}/repos?per_page=${this.repo_count}&sort=${this.repos_sort}&client_
        id=${this.client_id}&client_secret=${this.client_secret}`)
    const profileData = await profileRes.json(),
            repos = await profileRepo.json();
    return {
        profileData,
        repos
    }
    }
}
//the ui class
class UI {
    constructor() {
        this.profile = document.getElementById('profile')
        this.repo = document.getElementById('repos')

    }
    UISelector() {
        repo: 'repos'
    }
    showProfile(user) {
        this.profile.innerHTML = `
            <div class="card card-body mb-2">
                <div class="row">
                    <div class="col-md-3">
                        <img class="img-fluid mb-3 img-rounded" src="${user.avatar_url}">
                        <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-3">View Profile</a>
                    </div>
                    <div class="col-md-9">
                        <span class="badge badge-primary">Public Repo: ${user.public_repos}</span>
                        <span class="badge badge-secondary">Public Gist: ${user.public_gists}</span>
                        <span class="badge badge-info">Followers: ${user.followers}</span>
                        <span class="badge badge-success">Following: ${user.following}</span>
                        <br>
                        <ul class="list-group mt-3">
                            <li class="list-group-item">Company:${user.company} </li>
                            <li class="list-group-item">Website: ${user.blog}</li>
                            <li class="list-group-item">Location: ${user.location} </li>
                            <li class="list-group-item">Member Since:${user.created_at} </li>
                        </ul>
                    </div>
                </div>
            </div>
        
        `
    }
    showRepo(repos) {
        let output = '';
       
        repos.forEach(function(repo){
            output += `

                <div class="card card-body mb-3">
                    <div class="row">
                        <div clas="col-md-6">
                            <a href="${repo.html_url}" target="_blank" class="btn btn-success">${repo.name}</a>
                        </div>
                        <div clas="col-md-6">
                        
                        </div>
                    </div>
                </div>
            `
        });
        document.getElementById(UISelector.repo).innerHTML = output
    }
    clearProfile() {
        this.profile.innerHTML = '';
        this.repo.innerHTML = '';
    }

}
//instantiate the github class
const git = new Github;
//instantiate the ui class
const ui = new UI;
//Search input

const searchUser = document.getElementById('searchUser')

searchUser.addEventListener('keyup', search)

function search(e) {
    //get input value
        var userText = e.target.value
        if (userText !== '') {
            git.getUser(userText)
            .then(data => {
                if (data.profileData.message == 'Not Found') {
                        //show alert if user is not found
                    let output = '';
                    output += `
                        <h5 class="alert alert-danger">User Not Found</h5>
                    `
                    document.getElementById('error').innerHTML = output;
                    setTimeout(function load(){
                        document.querySelector('h5').remove()
                    }, 2000)
                    
                }
                else {
                        //show profile of the user
                    ui.showProfile(data.profileData)
                    ui.showRepo(data.repos)
                }
            })
        }
        else {
            ui.clearProfile()
            document.getElementById('repos').style.display ='none'
        }
}
