package model

import "flow-welcome/repository"

var roleModel *repository.RoleDBModel

func init() {
	roleModel = repository.InitRoleDBModel()
}

func RoleCollection(userId interface{}) ([]string, error) {
	roles, err := roleModel.SelectByUserId(userId)
	if err != nil {
		return nil, err
	}
	var roleKey []string
	for _, role := range roles {
		roleKey = append(roleKey, role.RoleName)
	}
	return roleKey, err
}
