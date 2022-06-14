const { Squat_1rm, Squat_1rm_comment, Squat_1rm_respect, User } = require('../../models');

module.exports = {
    //Squat_1rm게시물 조회
    get: async (req, res) => {
        try {
            //조회할 게시물 페이지들
            const { count } = req.params


            //squat__1rm게시물+user정보 
            const squat_1rms = await Squat_1rm.findAll({
                attributes: ['id', 'video', 'text_content', 'kg', 'createdAt'],//squat_1rm 컬럼들
                include: [
                    {
                        model: User,
                        attributes: ['nickname', 'profile_picture'],
                        require: true,
                    },
                ],
                order: [['id', 'DESC']],//정렬 id순으로 꺼꾸로
                raw: true,//dataValues만 가져오기
                limit: 5,//몇개불러올껀가
                offset: count * 5,//어디서부터시작할껀지
            });




            //조회한 게시물들의 고유번호값들 맵
            const squat_1rm_id = squat_1rms.map(item => item.id)
            console.log('::::::squat_1rm_id:', squat_1rm_id)




            // 조회한 게시물들의 댓글 + 유저정보
            const squat_1rm_comments = await Squat_1rm_comment.findAll({
                where: { squat_1rm_id },
                attributes: ['id', 'squat_1rm_id', 'text_content', 'createdAt'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'nickname', 'profile_picture'],
                        require: true,
                    }
                ],
                raw: true,//dataValues만 가져오기
            })




            //조회한 게시물들 라이크 
            const squat_1rm_respects = await Squat_1rm_respect.findAll({
                where: { squat_1rm_id },
                attributes: ['id', 'user_id', 'squat_1rm_id', 'createdAt'],
                raw: true,//dataValues만 가져오기
            })
            console.log(':::::::::::::squat_1rm_respects:', squat_1rm_respects)



            //조회한게시물+유저정보에 댓글+유저정보 push하기
            for (const squat_1rm of squat_1rms) {
                squat_1rm.comment = []
                squat_1rm.respect = []
                for (const comment of squat_1rm_comments) {
                    if (squat_1rm.id === comment.squat_1rm_id) {
                        squat_1rm.comment.push(comment)
                    }
                }
                for (const respect of squat_1rm_respects) {
                    if (squat_1rm.id === respect.squat_1rm_id) {
                        squat_1rm.respect.push(respect)
                    }
                }

            }

            console.log(':::::::::::::squat_1rms:', squat_1rms)


            return res.json({ message: 'ok', data: squat_1rms })
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server Error!' })
        }
    },
    //squat_1rm게시묵 작성
    post: async (req, res) => {
        try {
            if (!(req.body.user_id && req.body.text_content && req.file.location)) return res.status(400).json({ message: 'Bad Request!' })
            const { user_id, text_content, kg } = req.body
            console.log('::::::::::::::::user_id, text_content,kg:', user_id, text_content, kg)
            const { location } = req.file
            console.log(':::::::::::::location:', location)
            const post_info = {
                user_id,
                text_content,
                kg,
                video: location
            }
            await Squat_1rm.create(post_info);

            return res.status(201).json({ message: 'The post has been created' })
        }
        catch (err) {
            return res.status(500).json({ message: 'Server Error!' })
        }

    },
    //squat_1rm게시물 수정
    patch: async (req, res) => {
        try {
            //잘못된 요청
            if (!req.body.squat_1rm_id) return res.status(400).json({ message: 'Bad Request!' });
            //동영상 text_content 모두 바꾸는 경우
            if (req.file.location && req.body.text_content) {
                const { squat_1rm_id, text_content } = req.body
                const { location } = req.file
                await Squat_1rm.update(
                    {
                        text_content,
                        picture: location
                    },
                    {
                        where: { id: squat_1rm_id, }
                    },
                );
                return res.json({ message: 'The post has been changed' })
            }
            //텍스트만 바꾸는경우
            else if (req.body.text_content) {
                const { squat_1rm_id, text_content } = req.body
                const changed_squat_1rm = await Squat_1rm.update(
                    {
                        text_content,
                    },
                    {
                        where: { id: squat_1rm_id, }
                    },
                );
                return res.json({ message: 'The post has been changed' })
            }
            //동영상만 바꾸는경우
            else if (req.file.location) {
                const { squat_1rm_id } = req.body
                const { location } = req.file
                await Squat_1rm.update(
                    {
                        picture: location
                    },
                    {
                        where: { id: squat_1rm_id, }
                    },
                );
                return res.json({ message: 'The post has been changed' })
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server Error!' })
        }
    },
    //squat_1rm게시물 삭제
    delete: async (req, res) => {
        try {
            const { squat_1rm_id } = req.params
            await Squat_1rm.destroy({
                where: { id: squat_1rm_id },
            });
            return res.json({ message: 'The post has been deleted' })
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server Error!' })
        }
    },
}