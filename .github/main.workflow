workflow "Build develop" {
  on = "push"
  resolves = ["Push develop"]
}

workflow "Build master" {
  on = "push"
  resolves = ["Push master"]
}

workflow "Build other branches" {
  on = "push"
  resolves = ["Tag not master or develop"]
}

action "Build" {
  uses = "actions/docker/cli@master"
  args = "build -t maily-form ."
}

action "Login" {
  uses = "actions/docker/login@master"
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

# Only on develop
action "Filter develop" {
  uses = "actions/bin/filter@master"
  args = "branch develop"
}

action "Tag develop" {
  uses = "actions/docker/cli@master"
  needs = ["Filter develop", "Build"]
  args = "tag maily-form jlelse/maily-form:develop"
}

action "Push develop" {
  uses = "actions/docker/cli@master"
  needs = ["Login", "Tag develop"]
  args = "push jlelse/maily-form:develop"
}

# Only on master
action "Filter master" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Tag master" {
  uses = "actions/docker/cli@master"
  needs = ["Filter master", "Build"]
  args = "tag maily-form jlelse/maily-form:latest"
}

action "Push master" {
  uses = "actions/docker/cli@master"
  needs = ["Login", "Tag master"]
  args = "push jlelse/maily-form:latest"
}

# Only on branches not master or develop
action "Filter not master" {
  uses = "actions/bin/filter@master"
  args = "not branch master"
}

action "Filter not develop" {
  uses = "actions/bin/filter@master"
  args = "not branch develop"
}

action "Tag not master or develop" {
  uses = "actions/docker/cli@master"
  needs = ["Filter not develop", "Filter not master", "Build"]
  args = "tag maily-form jlelse/maily-form:neither"
}
