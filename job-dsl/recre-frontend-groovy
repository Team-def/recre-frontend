job('Recre Frontend Docker') {
    scm {
        git('https://github.com/Team-def/recre-frontend.git') {  node -> 
            node / gitConfigName('recre-deploy')
            node / gitConfigEmail('recredeploy@gmail.com')
        }
    }
    triggers {
        scm('H/5 * * * *')
    }
    wrappers {
        nodejs('nodejs')
    }
    steps {
        dockerBuildAndPublish { // 이번엔 shell script 대신에 
            repositoryName('recre-frontend/recre-frontend-docker') // docker hub 레포 이름
            tag('${GIT_REVISION,length=9}') // 태그 - 빈값이면 latest, GIT_REVISION은 고유한 커밋 sha 값
            registryCredentials('recre') // docker hub id
            forcePull(false) // 빌드하기 직전에 최신 이미지 갖고올지
            forceTag(false)
            createFingerprints(false)
            skipDecorate()
        }
    }
	}