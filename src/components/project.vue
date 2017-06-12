<template lang="html">
  <div>
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <p>
            Project Name (breadcrumbs?)
            Project Owner
            Last Updated Date
            Current Config (change config)
            Current Revision (change revision)
            Clone Project / Import Project
          </p>
          <br>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class='panel panel-default'>
            <div class="panel-heading">
              <i class="fa fa-folder-open-o text-primary" aria-hidden="true"></i>
              &nbsp
              My Projects
              <router-link to='/project'>
                <button class='btn btn-default btn-xs pull-right'>
                  <i class="fa fa-plus" aria-hidden="true"> </i>
                  New Project
                </button>
              </router-link>
            </div>
            <div class="panel-body">
              You are not a team member for any projects.
              <br><br>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
